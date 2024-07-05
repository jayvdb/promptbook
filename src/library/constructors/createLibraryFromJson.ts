import type { PromptbookJson } from '../../types/PromptbookJson/PromptbookJson';
import type { PromptbookLibrary } from '../PromptbookLibrary';
import { SimplePromptbookLibrary } from '../SimplePromptbookLibrary';

/**
 * Creates PromptbookLibrary from array of PromptbookJson or PromptbookString
 *
 * Note: Functions `libraryToJson` and `createLibraryFromJson` are complementary
 * Note: During the construction syntax and logic of all sources are validated
 *
 * @param promptbookSources
 * @returns PromptbookLibrary
 */
export function createLibraryFromJson(...promptbooks: Array<PromptbookJson>): PromptbookLibrary {
    return new SimplePromptbookLibrary(...promptbooks);
}