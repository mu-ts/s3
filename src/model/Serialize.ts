import { Document } from './Document';

/**
 * Interface for custom implementations on serializing objects before they
 * are persisted to S3.
 */
export type Serialize = (document: Document) => string;
