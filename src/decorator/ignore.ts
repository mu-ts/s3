import { CollectionRegistry } from '../service/CollectionRegistry';

/**
 * Indicates that a field should be ignored.
 */
export function ignore(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    CollectionRegistry.register(target, { ignore: [propertyKey] });
    return descriptor;
  };
}
