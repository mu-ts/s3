import { BucketRegistry } from '../guts/BucketRegistry';

/**
 * Marks an attribute to have ist value encrypted. Encryption happens before
 * encoding during serialization.
 * 
 * @param secret used to encrypt the value.
 * @returns 
 */
export function encrypt(secret: string): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    BucketRegistry.setAttributes(target, propertyKey, { encrypted: true, encryptSecret: secret });
    return descriptor;
  };
}