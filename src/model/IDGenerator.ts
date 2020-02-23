import { Document } from './Document';

/**
 * Interface to be implemented to specify the generator pattern for
 * a collection.
 */
export type IDGenerator = (document: Document, uuid: string) => string;
