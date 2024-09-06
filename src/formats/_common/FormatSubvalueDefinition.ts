import type { Promisable } from 'type-fest';
import type { Parameters, string_name } from '../../types/typeAliases';
import { string_SCREAMING_CASE } from '../../_packages/types.index';

/**
 * @@@
 */
export type FormatSubvalueDefinition<TValue extends string> = {
    /**
     * The name of the format used in .ptbk.md files
     *
     * @sample "CELL"
     */
    readonly subvalueName: string_name & string_SCREAMING_CASE;

    /**
     * Aliases for the `subvalueName`
     */
    readonly aliases?: Array<string_name & string_SCREAMING_CASE>;

    /**
     * Parses just the values and removes structural information
     *
     * Note: This is useful when you want to combine format expectations with counting words, characters,...
     *
     * @param value The value to check, for example "{\"name\": "John Smith"}"
     * @example "{\"name\": "John Smith"}" -> ["John Smith"]
     */
    extractValues(value: TValue): Parameters;

    /**
     * Maps values
     *
     * For example, if you have a JSON object and you want to map all values to uppercase
     * Or iterate over all CSV cells @@@
     */
    mapValues(
        value: TValue,
        mapCallback: (subvalues: Parameters, index: number) => Promisable<string>,
    ): Promise<string>;
};

/**
 * TODO: [🧠][🦥] Better (less confusing) name for "cell" / "subvalue" / "subparameter"
 * Note: [👩🏾‍🤝‍🧑🏽]
 */
