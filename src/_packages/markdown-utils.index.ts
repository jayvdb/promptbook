// ⚠️ WARNING: This code has been generated so that any manual changes will be overwritten
// `@promptbook/markdown-utils`
import type {
    string_markdown,
    string_markdown_section,
    string_markdown_section_content,
    string_markdown_text,
} from '../types/typeAliases';
import { addAutoGeneratedSection } from '../utils/markdown/addAutoGeneratedSection';
import { createMarkdownChart } from '../utils/markdown/createMarkdownChart';
import { createMarkdownTable } from '../utils/markdown/createMarkdownTable';
import { escapeMarkdownBlock } from '../utils/markdown/escapeMarkdownBlock';
import { extractAllBlocksFromMarkdown } from '../utils/markdown/extractAllBlocksFromMarkdown';
import { extractAllListItemsFromMarkdown } from '../utils/markdown/extractAllListItemsFromMarkdown';
import { extractOneBlockFromMarkdown } from '../utils/markdown/extractOneBlockFromMarkdown';
import { flattenMarkdown } from '../utils/markdown/flattenMarkdown';
import type { MarkdownSection } from '../utils/markdown/parseMarkdownSection';
import { parseMarkdownSection } from '../utils/markdown/parseMarkdownSection';
import { removeContentComments } from '../utils/markdown/removeContentComments';
import { removeMarkdownFormatting } from '../utils/markdown/removeMarkdownFormatting';
import { splitMarkdownIntoSections } from '../utils/markdown/splitMarkdownIntoSections';
import { PROMPTBOOK_VERSION } from '../version';

// Note: Exporting version from each package
export { PROMPTBOOK_VERSION };

// Note: Entities of the `@promptbook/markdown-utils`
export {
    addAutoGeneratedSection,
    createMarkdownChart,
    createMarkdownTable,
    escapeMarkdownBlock,
    extractAllBlocksFromMarkdown,
    extractAllListItemsFromMarkdown,
    extractOneBlockFromMarkdown,
    flattenMarkdown,
    parseMarkdownSection,
    removeContentComments,
    removeMarkdownFormatting,
    splitMarkdownIntoSections,
};
export type {
    MarkdownSection,
    string_markdown,
    string_markdown_section,
    string_markdown_section_content,
    string_markdown_text,
};
