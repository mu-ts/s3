import { CollectionRegistry } from '../service/CollectionRegistry';
import { CollectionRegistryImpl } from '../service/impl/CollectionRegistryImpl';

/**
 * Indicates that field is to be saved as a tag, rather than within the body.
 */
export function encrypt(secret: string | Buffer): any {
  const collectionRegistry: CollectionRegistry = new CollectionRegistryImpl();
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    collectionRegistry.register(target, { 'fields.encrypt': [propertyKey] });
    collectionRegistry.register(target, { 'fields.encrypt.secret': [typeof secret === 'string' ? Buffer.from(secret) : secret] });
    return descriptor;
  };
}
