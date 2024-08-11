import colors from 'colors';
import type { Command as Program /* <- Note: Using Program because Command is misleading name */ } from 'commander';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import spaceTrim from 'spacetrim';
import { collectionToJson } from '../../collection/collectionToJson';
import { createCollectionFromDirectory } from '../../collection/constructors/createCollectionFromDirectory';
import { GENERATOR_WARNING_BY_PROMPTBOOK_CLI, PIPELINE_COLLECTION_BASE_FILENAME } from '../../config';
import { stringifyPipelineJson } from '../../conversion/utils/stringifyPipelineJson';
import { validatePipeline } from '../../conversion/validation/validatePipeline';
import { usageToHuman } from '../../execution/utils/usageToHuman';
import { getLlmToolsForCli } from '../../llm-providers/_common/getLlmToolsForCli';
import type { string_file_extension } from '../../types/typeAliases';

/**
 * Initializes `make` command for Promptbook CLI utilities
 *
 * @private internal function of `promptbookCli`
 */
export function initializeMakeCommand(program: Program) {
    const makeCommand = program.command('make');
    makeCommand.description(
        spaceTrim(`
            Makes a new pipeline collection in given folder
      `),
    );

    makeCommand.argument(
        '[path]',
        // <- TODO: [🧟‍♂️] Unite path to promptbook collection argument
        'Path to promptbook directory',
        './promptbook-collection',
    );
    makeCommand.option('--project-name', `Name of the project for whom collection is`, 'Untitled Promptbook project');
    makeCommand.option(
        '-f, --format <format>',
        spaceTrim(`
            Output format of builded collection "javascript", "typescript" or "json"

            Note: You can use multiple formats separated by comma
        `),
        'javascript' /* <- Note: [🏳‍🌈] */,
    );
    makeCommand.option('--no-validation', `Do not validate logic of pipelines in collection`, true);
    makeCommand.option(
        '--validation',
        `Types of validations separated by comma (options "logic","imports")`,
        'logic,imports',
    );

    makeCommand.option('--reload-cache', `Use LLM models even if cached `, false);
    makeCommand.option('--verbose', `Is verbose`, false);
    makeCommand.option(
        '-o, --out-file <path>',
        spaceTrim(`
            Where to save the builded collection

            Note: If you keep it "${PIPELINE_COLLECTION_BASE_FILENAME}" it will be saved in the root of the promptbook directory
                  If you set it to a path, it will be saved in that path
                  BUT you can use only one format and set correct extension
        `),
        PIPELINE_COLLECTION_BASE_FILENAME,
    );

    makeCommand.action(async (path, { projectName, format, validation, reloadCache, verbose, outFile }) => {
        const isCacheReloaded = reloadCache;
        const isVerbose = verbose;

        let formats = ((format as string | false) || '')
            .split(',')
            .map((_) => _.trim())
            .filter((_) => _ !== '');
        const validations = ((validation as string | false) || '')
            .split(',')
            .map((_) => _.trim())
            .filter((_) => _ !== '');

        if (outFile !== PIPELINE_COLLECTION_BASE_FILENAME && formats.length !== 1) {
            console.error(colors.red(`You can only use one format if you specify --out-file`));
            process.exit(1);
        }

        const llmTools = getLlmToolsForCli({
            isCacheReloaded,
        });

        const collection = await createCollectionFromDirectory(path, {
            llmTools,
            isVerbose,
            isRecursive: true,
            // <- TODO: [🍖] isCacheReloaded
        });

        for (const validation of validations) {
            for (const pipelineUrl of await collection.listPipelines()) {
                const pipeline = await collection.getPipelineByUrl(pipelineUrl);

                if (validation === 'logic') {
                    validatePipeline(pipeline);

                    if (verbose) {
                        console.info(colors.cyan(`Validated logic of ${pipeline.pipelineUrl}`));
                    }
                }

                // TODO: Imports validation
            }
        }

        const collectionJson = await collectionToJson(collection);
        const collectionJsonString = stringifyPipelineJson(collectionJson);

        const saveFile = async (extension: string_file_extension, content: string) => {
            const filePath =
                outFile !== PIPELINE_COLLECTION_BASE_FILENAME
                    ? outFile
                    : join(path, `${PIPELINE_COLLECTION_BASE_FILENAME}.${extension}`);

            if (!outFile.endsWith(`.${extension}`)) {
                console.warn(colors.yellow(`Warning: Extension of output file should be "${extension}"`));
            }

            await mkdir(dirname(filePath), { recursive: true });
            await writeFile(filePath, content, 'utf-8');

            // Note: Log despite of verbose mode
            console.info(colors.green(`Maked ${filePath.split('\\').join('/')}`));
        };

        if (formats.includes('json')) {
            formats = formats.filter((format) => format !== 'json');
            await saveFile('json', collectionJsonString);
            //                            <- TODO: Add GENERATOR_WARNING_BY_PROMPTBOOK_CLI to package.json
        }

        if (formats.includes('javascript') || formats.includes('js')) {
            formats = formats.filter((format) => format !== 'javascript' && format !== 'js');
            (await saveFile(
                'js',
                spaceTrim(
                    (block) => `
                        // ${block(GENERATOR_WARNING_BY_PROMPTBOOK_CLI)}

                        import { createCollectionFromJson } from '@promptbook/core';

                        /**
                         * Pipeline collection for ${projectName}
                         *
                         * ${block(GENERATOR_WARNING_BY_PROMPTBOOK_CLI)}
                         *
                         * @private internal cache for \`getPipelineCollection\`
                         */
                        let pipelineCollection = null;


                        /**
                         * Get pipeline collection for ${projectName}
                         *
                         * ${block(GENERATOR_WARNING_BY_PROMPTBOOK_CLI)}
                         *
                         * @returns {PipelineCollection} Library of promptbooks for ${projectName}
                         */
                        export function getPipelineCollection(){
                            if(pipelineCollection===null){
                                pipelineCollection = createCollectionFromJson(
                                    ${block(collectionJsonString)}
                                );
                            }

                            return pipelineCollection;
                        }
                    `,
                ),
                // <- TODO: [0] DRY Javascript and typescript
                // <- TODO: Prettify
                // <- TODO: Convert inlined \n to spaceTrim
                // <- Note: [🍡]
            )) + '\n';
        }

        if (formats.includes('typescript') || formats.includes('ts')) {
            formats = formats.filter((format) => format !== 'typescript' && format !== 'ts');
            await saveFile(
                'ts',
                spaceTrim(
                    (block) => `
                        // ${block(GENERATOR_WARNING_BY_PROMPTBOOK_CLI)}

                        import { createCollectionFromJson } from '@promptbook/core';
                        import type { PipelineCollection } from '@promptbook/types';

                        /**
                         * Pipeline collection for ${projectName}
                         *
                         * ${block(GENERATOR_WARNING_BY_PROMPTBOOK_CLI)}
                         *
                         * @private internal cache for \`getPipelineCollection\`
                         */
                        let pipelineCollection: null | PipelineCollection = null;


                        /**
                         * Get pipeline collection for ${projectName}
                         *
                         * ${block(GENERATOR_WARNING_BY_PROMPTBOOK_CLI)}
                         *
                         * @returns {PipelineCollection} Library of promptbooks for ${projectName}
                         */
                        export function getPipelineCollection(): PipelineCollection{
                            if(pipelineCollection===null){
                                pipelineCollection = createCollectionFromJson(
                                    ${block(collectionJsonString)}
                                );
                            }

                            return pipelineCollection as PipelineCollection;
                        }
                    `,
                ) + '\n',
                // <- TODO: [0] DRY Javascript and typescript
                // <- TODO: Prettify
                // <- TODO: Convert inlined \n to spaceTrim
                // <- Note: [🍡]
            );
        }

        if (formats.length > 0) {
            console.warn(colors.yellow(`Format ${formats.join(' and ')} is not supported`));
        }

        if (isVerbose) {
            console.info(colors.green(`Collection builded`));
            console.info(colors.cyan(usageToHuman(llmTools.getTotalUsage())));
        }

        process.exit(0);
    });
}

/**
 * TODO: Maybe remove this command - "about" command should be enough?
 * TODO: [0] DRY Javascript and typescript - Maybe make ONLY typescript and for javascript just remove types
 * Note: [🟡] This code should never be published outside of `@promptbook/cli`
 * TODO: [🖇] What about symlinks? Maybe flag --follow-symlinks
 */
