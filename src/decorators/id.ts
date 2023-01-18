import { BucketRegistry } from '../guts/BucketRegistry';
import { IDGenerator } from '../model/IDGenerator';
import { UUIDV5 } from '../model/UUIDV5';

/**
 * Only a single attribute can be documented as the id for the object.
 *
 * @param generator function that implements IDGenerator or uuid (v4).
 * @returns 
 */
export function id(generator: IDGenerator | 'uuid' | UUIDV5): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    BucketRegistry.setId(target, propertyKey, generator);
    return descriptor;
  };
}