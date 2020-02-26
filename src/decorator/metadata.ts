import { CollectionRegistry } from '../service/CollectionRegistry';
import { CollectionRegistryImpl } from '../service/impl/CollectionRegistryImpl';

/**
 * Indicates that field is to be saved as a tag, rather than within the body.
 */
export function metadata(preserve: boolean = false): any {
  const collectionRegistry: CollectionRegistry = new CollectionRegistryImpl();
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    collectionRegistry.register(target, { 'fields.metadata': [propertyKey] });
    if (preserve) collectionRegistry.register(target, { 'fields.metadata.preserved': [propertyKey] });
    return descriptor;
  };
}
