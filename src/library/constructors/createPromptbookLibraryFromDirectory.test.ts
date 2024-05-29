import { describe, expect, it } from '@jest/globals';
import spaceTrim from 'spacetrim';
import { promptbookStringToJson } from '../../conversion/promptbookStringToJson';
import type { PromptbookString } from '../../types/PromptbookString';
import { createPromptbookLibraryFromDirectory } from './createPromptbookLibraryFromDirectory';

// TODO: !!!! Pass the test

describe('createPromptbookLibraryFromDirectory', () => {
    const promptbook = spaceTrim(`
          # ✨ Sample prompt with URL

          Show how to use a simple prompt with no parameters.

          -   PROMPTBOOK URL https://promptbook.example.com/samples/simple.ptbk.md@v1
          -   PROMPTBOOK VERSION 1.0.0
          -   MODEL VARIANT Chat
          -   MODEL NAME gpt-3.5-turbo
          -   OUTPUT PARAMETER \`{greeting}\`


          ## 💬 Prompt

          \`\`\`text
          Hello
          \`\`\`

          -> {greeting}


    `) as PromptbookString;

    const library = createPromptbookLibraryFromDirectory('./samples/templates', { isVerbose: true });

    it('should get promptbook by url from library', () =>
        expect(
            (async () => {
                const promptbookFromLibrary = await library.getPromptbookByUrl(
                    'https://promptbook.example.com/samples/simple.ptbk.md@v1',
                );
                return promptbookFromLibrary;
            })(),
        ).resolves.toEqual(promptbookStringToJson(promptbook)));

    it('should get different promptbook by url from library', () =>
        expect(
            (async () => {
                const promptbookFromLibrary = await library.getPromptbookByUrl(
                    'https://promptbook.example.com/samples/jokers.ptbk.md@v1',
                );
                return promptbookFromLibrary.title;
            })(),
        ).resolves.toBe('✨ Sample: Jokers'));
});