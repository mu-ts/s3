import { CollectionRegistry } from '../service/CollectionRegistry';
import { CollectionRegistryImpl } from '../service/impl/CollectionRegistryImpl';

/**
 * Indicates that a field should be ignored.
 */
export function ignore(): any {
  const collectionRegistry: CollectionRegistry = new CollectionRegistryImpl();
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    collectionRegistry.register(target, { 'fields.ignore': [propertyKey] });
    return descriptor;
  };
}
