import { RESERVED_PARAMETER_NAMES } from '../../../config';
import { ParseError } from '../../../errors/ParseError';
import { string_parameter_name, string_reserved_parameter_name } from '../../../types/typeAliases';
import { normalizeTo_camelCase } from '../../normalization/normalizeTo_camelCase';

/**
 * Function `validateParameterName` will @@@
 *
 * @param parameterName @@@
 * @returns @@@
 * @throws {ParseError} @@@
 * @private within the repository
 */
/**
 *
 * @param parameterName
 */

export function validateParameterName(parameterName: string): string_parameter_name {
    for (const [start, end] of [
        ['`', '`'],
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
        ['<', '>'],
    ]) {
        if (
            parameterName.substring(0, 1) === start &&
            parameterName.substring(parameterName.length - 1, parameterName.length) === end
            // <- TODO: More universal that 1 character
        ) {
            parameterName = parameterName.substring(1, parameterName.length - 1);
            // <- TODO: More universal that 1 character
        }
    }

    /*
  Note: We don't need to check for spaces because we are going to normalize the parameter name to camelCase
  if (parameterName.includes(' ')) {
      throw new ParseError(`Parameter name cannot contain spaces`);
  }
  */
    if (parameterName.includes('.')) {
        throw new ParseError(`Parameter name cannot contain dots`);
    }

    if (parameterName.includes('/') || parameterName.includes('\\')) {
        throw new ParseError(`Parameter name cannot contain slashes`);
    }

    if (
        parameterName.includes('(') ||
        parameterName.includes(')') ||
        parameterName.includes('{') ||
        parameterName.includes('}') ||
        parameterName.includes('[') ||
        parameterName.includes(']')
    ) {
        throw new ParseError(`Parameter name cannot contain braces`);
    }

    parameterName = normalizeTo_camelCase(parameterName);

    if (parameterName === '') {
        throw new ParseError(`Parameter name cannot be empty`);
    }

    if (RESERVED_PARAMETER_NAMES.includes(parameterName as string_reserved_parameter_name)) {
        throw new ParseError(`{${parameterName}} is a reserved parameter name`);
    }

    return parameterName;
}
