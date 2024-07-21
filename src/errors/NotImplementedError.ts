import { spaceTrim } from 'spacetrim';

/**
 * This error type indicates that some part of the code is not implemented yet
 */
export class NotImplementedError extends Error {
    public readonly name = 'NotImplementedError';
    public constructor(message: string) {
        super(
            spaceTrim(
                (block) => `
                    ${block(message)}

                    Note: This feature is not implemented yet but it will be soon.

                    If you want speed up the implementation or just read more, look here:
                    https://github.com/webgptorg/promptbook

                    Or contact us on me@pavolhejny.com

                `,
            ),
        );
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}
