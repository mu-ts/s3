import { CollectionRegistry } from '../service/CollectionRegistry';
import { CollectionRegistryImpl } from '../service/impl/CollectionRegistryImpl';

/**
 * Indicates that field is to be saved as a tag, rather than within the body.
 */
export function encode(algorithm: string = 'hex'): any {
  const collectionRegistry: CollectionRegistry = new CollectionRegistryImpl();
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    collectionRegistry.register(target, { 'fields.encode': [propertyKey] });
    collectionRegistry.register(target, { 'fields.encode.algorithm': [algorithm] });
    return descriptor;
  };
}
