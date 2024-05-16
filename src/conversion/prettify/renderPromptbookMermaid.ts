import { spaceTrim } from 'spacetrim';
import type { PromptbookJson, PromptTemplateJson } from '../../_packages/types.index';
import { normalizeTo_camelCase } from '../../_packages/utils.index';
import { UnexpectedError } from '../../errors/UnexpectedError';
import type { string_href, string_name } from '../../types/typeAliases';
import { titleToName } from '../utils/titleToName';

/**
 * Addtional options for rendering Mermaid graph
 */
export type renderPromptbookMermaidOptions = {
    /**
     * Callback for creating from prompt template graph node
     */
    linkPromptTemplate?(promptTemplate: PromptTemplateJson): { href: string_href; title: string } | null;
};

/**
 * Creates a Mermaid graph based on the promptbook
 *
 * Note: The result is not wrapped in a Markdown code block
 */
export function renderPromptbookMermaid(
    promptbookJson: PromptbookJson,
    options?: renderPromptbookMermaidOptions,
): string {
    const { linkPromptTemplate = () => null } = options || {};

    const parameterNameToTemplateName = (parameterName: string_name) => {
        const parameter = promptbookJson.parameters.find((parameter) => parameter.name === parameterName);

        if (!parameter) {
            throw new UnexpectedError(`Could not find {${parameterName}}`);
        }

        if (parameter.isInput) {
            return 'input';
        }

        const template = promptbookJson.promptTemplates.find(
            (template) => template.resultingParameterName === parameterName,
        );

        if (!template) {
            throw new Error(`Could not find template for {${parameterName}}`);
        }

        return normalizeTo_camelCase('template-' + titleToName(template.title));
    };

    const promptbookMermaid = spaceTrim(
        (block) => `

            %% 🔮 Tip: Open this on GitHub or in the VSCode website to see the Mermaid graph visually

            flowchart LR
              subgraph "${promptbookJson.title}"

                  direction TB

                  input((Input)):::input
                  ${block(
                      promptbookJson.promptTemplates
                          .flatMap(({ title, dependentParameterNames, resultingParameterName }) => [
                              `${parameterNameToTemplateName(resultingParameterName)}("${title}")`,
                              ...dependentParameterNames.map(
                                  (dependentParameterName) =>
                                      `${parameterNameToTemplateName(
                                          dependentParameterName,
                                      )}--"{${dependentParameterName}}"-->${parameterNameToTemplateName(
                                          resultingParameterName,
                                      )}`,
                              ),
                          ])
                          .join('\n'),
                  )}

                  ${block(
                      promptbookJson.parameters
                          .filter(({ isOutput }) => isOutput)
                          .map(({ name }) => `${parameterNameToTemplateName(name)}--"{${name}}"-->output`)
                          .join('\n'),
                  )}
                  output((Output)):::output

                  ${block(
                      promptbookJson.promptTemplates
                          .map((promptTemplate) => {
                              const link = linkPromptTemplate(promptTemplate);

                              if (link === null) {
                                  return '';
                              }

                              const { href, title } = link;

                              const templateName = parameterNameToTemplateName(promptTemplate.resultingParameterName);

                              return `click ${templateName} href "${href}" "${title}";`;
                          })
                          .filter((line) => line !== '')
                          .join('\n'),
                  )}

                  classDef input color: grey;
                  classDef output color: grey;

              end;

        `,
    );

    return promptbookMermaid;
}

/**
 * TODO: Maybe use some Mermaid library instead of string templating
 * TODO: [🕌] When more than 2 functionalities, split into separate functions
 */