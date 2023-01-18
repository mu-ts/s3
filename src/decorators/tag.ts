import { BucketRegistry } from '../guts/BucketRegistry';

/**
 * When an attribute is tagged, it becomes an metadata value and is not
 * serialized within the body of the saved object.
 */
export function tag(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    BucketRegistry.setAttributes(target, propertyKey, { tag: true });
    return descriptor;
  };
}