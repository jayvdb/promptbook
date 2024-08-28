import type { PipelineJson } from '../types/PipelineJson/PipelineJson';
import { extractParameterNames } from '../utils/extractParameterNames';
import { $asDeeplyFrozenSerializableJson } from '../utils/serialization/$asDeeplyFrozenSerializableJson';

/**
 * Unprepare just strips the preparation data of the pipeline
 *
 * @public exported from `@promptbook/core`
 */
export function unpreparePipeline(pipeline: PipelineJson): PipelineJson {
    let { personas, knowledgeSources, promptTemplates } = pipeline;

    personas = personas.map((persona) => ({ ...persona, modelRequirements: undefined, preparationIds: undefined }));
    knowledgeSources = knowledgeSources.map((knowledgeSource) => ({ ...knowledgeSource, preparationIds: undefined }));
    promptTemplates = promptTemplates.map((promptTemplate) => {
        let { dependentParameterNames } = promptTemplate;

        const parameterNames = extractParameterNames(promptTemplate.preparedContent || '');

        dependentParameterNames = dependentParameterNames.filter(
            (dependentParameterName) => !parameterNames.has(dependentParameterName),
            // <- [🏷] This is the reverse process to remove {knowledge} from `dependentParameterNames`
        );

        const promptTemplateUnprepared = { ...promptTemplate, dependentParameterNames };
        delete promptTemplateUnprepared.preparedContent;

        return promptTemplateUnprepared;
    });

    return $asDeeplyFrozenSerializableJson('Unprepared PipelineJson', {
        ...pipeline,
        promptTemplates,
        knowledgeSources,
        knowledgePieces: [],
        personas,
        preparations: [],
    });
}

/**
 * TODO: [🧿] Maybe do same process with same granularity and subfinctions as `preparePipeline`
 * TODO: Write tests for `preparePipeline`
 * TODO: [🍙] Make some standard order of json properties
 */
