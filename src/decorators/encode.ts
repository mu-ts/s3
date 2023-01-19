import { BucketRegistry } from '../guts/BucketRegistry';

/**
 * Encodes a value while it is being serialized.
 * 
 * @param encoding to use, if omitted 'HEX' is used.
 * @returns 
 */
export function encode(encoding?: BufferEncoding): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    BucketRegistry.setAttributes(target, propertyKey, { encoded: true, encoding: encoding});
    return descriptor;
  };
}