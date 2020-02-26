import { IDGenerator } from '../model/functions/IDGenerator';
import { CollectionRegistry } from '../service/CollectionRegistry';
import { CollectionRegistryImpl } from '../service/impl/CollectionRegistryImpl';

/**
 * Tells the collection what attribute is to be used as the id for the documents.
 *
 * Usage: On an attribute @id() and optionally provide a generator to create the ID's if the default of UUID4 is not desired.
 *
 * @param generator for the ID if nothing is provided.
 */
export function key(generator?: IDGenerator): any {
  const collectionRegistry: CollectionRegistry = new CollectionRegistryImpl();
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    collectionRegistry.register(target, { 'id.name': propertyKey });
    if (generator) collectionRegistry.register(target, { 'id.generator': generator });
    return descriptor;
  };
}
