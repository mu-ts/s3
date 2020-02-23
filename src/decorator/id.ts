import { IDGenerator } from '../model/IDGenerator';
import { Registry } from '../service/Registry';

/**
 * Tells the collection what attribute is to be used as the id for the documents.
 *
 * Usage: On an attribute @id() and optionally provide a generator to create the ID's if the default of UUID4 is not desired.
 *
 * @param generator for the ID if nothing is provided.
 */
export function id(generator?: IDGenerator): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Registry.register(target.constructor.name, { 'id.name': propertyKey });
    if (generator) Registry.register(target.constructor.name, { 'id.generator': generator });
    return descriptor;
  };
}
