import { IDGenerator } from './IDGenerator';

export interface Metadata {
  /**
   * Where to locate, or populate, the id for a document on an object mapped to the
   * type.
   */
  'id.name'?: string;

  /**
   * The value that will preceed any key, regardless of its generation strategy,
   * or the behavior utilized.
   */
  'id.prefix'?: string;

  /**
   * Function to execute when an ID needs to be generate for a document.
   */
  'id.generator'?: IDGenerator;

  /**
   * Bucket name for the type.
   */
  'bucket.name'?: string;

  /**
   * Fiels that will not be serialized but instead be converted
   * to tags on the document.
   */
  tag?: string[];

  /**
   * Fields that will be redacted, and not serialized nor tagged. Omitted completely from S3.
   */
  ignore?: string[];
}
