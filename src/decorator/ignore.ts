import { Collection } from '../service/Collection';

/**
 * Indicates that a field should be ignored.
 */
export function ignore(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Collection.set(target, { ignore: [propertyKey] });
    return descriptor;
  };
}
