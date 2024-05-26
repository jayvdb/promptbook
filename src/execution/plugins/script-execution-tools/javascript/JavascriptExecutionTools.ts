import { PromptbookExecutionError } from '../../../../errors/PromptbookExecutionError';
import { ScriptExecutionTools, ScriptExecutionToolsExecuteOptions } from '../../../ScriptExecutionTools';
import { JavascriptExecutionToolsOptions } from './JavascriptExecutionToolsOptions';

/**
 * ScriptExecutionTools for JavaScript implemented via vm2
 *
 * Warning: This is not implemented yet
 */
export class JavascriptExecutionTools implements ScriptExecutionTools {
    private readonly options: JavascriptExecutionToolsOptions;

    public constructor(options?: JavascriptExecutionToolsOptions) {
        this.options = options || {};
    }

    /**
     * Executes a JavaScript
     */
    public async execute(options: ScriptExecutionToolsExecuteOptions): Promise<string> {
        const { scriptLanguage /*, script, parameters */ } = options;

        if (scriptLanguage !== 'javascript') {
            throw new PromptbookExecutionError(
                `Script language ${scriptLanguage} not supported to be executed by JavascriptExecutionTools`,
            );
        }

        throw new PromptbookExecutionError('Not implemented');
    }
}

/**
 * TODO: !! Pass isVerbose to constructor and use it
 * TODO: !! Probbably make some common util createStatementToEvaluate
 * TODO: !! Implement via vm2
 */
