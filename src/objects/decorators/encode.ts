/**
 * Encodes a value while it is being serialized.
 * 
 * @param encoding to use, if omitted 'HEX' is used.
 * @returns 
 */
export function encode(encoding?: BufferEncoding): any {
  return function encodeDecorator(originalMethod: any, context: ClassFieldDecoratorContext): void {
    context.addInitializer(function (): void {
      const { name } = context;
      const metadata = this.constructor['mu-ts'];
      if (metadata) {
        if (!metadata['encode']) metadata['encode'] = [];
        metadata['encode'].push({field: name, encoding })
      }
    })
  };
}
