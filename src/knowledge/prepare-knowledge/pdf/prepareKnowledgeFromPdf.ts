import { MAX_PARALLEL_COUNT } from '../../../config';
import { PrepareOptions } from '../../../prepare/PrepareOptions';
import { KnowledgePiecePreparedJson } from '../../../types/PipelineJson/KnowledgePieceJson';
import type { string_base64 } from '../../../types/typeAliases';
import { TODO_USE } from '../../../utils/organization/TODO_USE';
import { prepareKnowledgeFromMarkdown } from '../markdown/prepareKnowledgeFromMarkdown';

/**
 * @@@
 */
export async function prepareKnowledgeFromPdf(
    content: string_base64 /* <- TODO: [🖖] Always the file, allow base64+filename+identification+mime or blob+filename+identification or file+identification */,
    options: PrepareOptions,
): Promise<KnowledgePiecePreparedJson> {
    const { llmTools, maxParallelCount = MAX_PARALLEL_COUNT, isVerbose = false } = options;

    TODO_USE(llmTools, maxParallelCount, isVerbose);

    /*
    [🧺]
    if (content.type !== 'application/pdf') {
        throw new Error('The content is not a PDF file');
    }
    */

    // TODO: !!! Convert PDF to markdown

    return prepareKnowledgeFromMarkdown('TODO: !!! Convert PDF to markdown', options);
}

/**
 * TODO: [🧺] In future, content can be alse File or Blob BUT for now for wider compatibility its only base64
 *       @see https://stackoverflow.com/questions/14653349/node-js-cant-create-blobs
 * TODO: [🪂] Do it in parallel
 */
