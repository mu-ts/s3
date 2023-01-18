import { BucketRegistry } from '../guts/BucketRegistry';

/**
 * An attribute marked as ignored will not be persisted at all.
 */
export function ignore(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    BucketRegistry.setAttributes(target, propertyKey, { ignored: true });
    return descriptor;
  };
}