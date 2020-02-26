import { Collection } from '../model/Collection';
import { Document } from '../model/Document';

/**
 * Interface that allows modifying the default serialization behaviors.
 */
export interface SerializerServices {
  serialize<T>(object: T, collection: Collection, document: Document): string;
  deserialize<T>(body: string, collection: Collection): T;
}
