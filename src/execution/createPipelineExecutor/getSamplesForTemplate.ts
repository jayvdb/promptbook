import { RESERVED_PARAMETER_MISSING_VALUE } from '../../config';
import type { TemplateJson } from '../../types/PipelineJson/TemplateJson';
import { string_markdown, string_parameter_value } from '../../types/typeAliases';
import { TODO_USE } from '../../utils/organization/TODO_USE';

export async function getSamplesForTemplate(template: TemplateJson): Promise<string_parameter_value & string_markdown> {
    // TODO: [♨] Implement Better - use real index and keyword search

    TODO_USE(template);
    return RESERVED_PARAMETER_MISSING_VALUE /* <- TODO: [♨] Implement */;
}
