import { Document } from '../service/Document';
import { Collection } from '../service/Collection';

/**
 * Interface for custom implementations on serializing objects before they
 * are persisted to S3.
 */
export type Serializer = <T>(object: T, collection: Collection, document: Document) => string;
