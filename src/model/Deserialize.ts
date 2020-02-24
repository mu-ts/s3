import { Collection } from '../service/Collection';

/**
 * Interface for custom implementations on serializing objects before they
 * are persisted to S3.
 */
export type Deserializer = <T>(body: string, collection: Collection) => T;
