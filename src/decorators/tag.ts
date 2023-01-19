import { BucketRegistry } from '../guts/BucketRegistry';

/**
 * When an attribute is tagged, it becomes an metadata value and is not
 * serialized within the body of the saved object. There is a limit to the number of
 * tags so be careful about declaring to many.
 */
export function tag(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    BucketRegistry.setAttributes(target, propertyKey, { tag: true });
    return descriptor;
  };
}