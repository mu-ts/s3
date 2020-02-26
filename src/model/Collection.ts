import { IDGenerator } from './functions/IDGenerator';

export interface Collection {
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
   * to metadata on the document.
   */
  'fields.metadata'?: string[];

  /**
   * Fields that are marked as metadata, but that will not be removed from the object.
   */
  'fields.metadata.preserved'?: string[];

  /**
   * Fields that will be redacted, and not serialized nor tagged. Omitted completely from S3.
   */
  'fields.ignore'?: string[];

  /**
   * Fields that will be hashed before being persisted.
   */
  'fields.encode'?: string[];

  /**
   * Algorithm to use when hashing/dehashing the field value.
   */
  'fields.encode.algorithm'?: string[];

  /**
   * Fields that will be encrypted before being persisted.
   */
  'fields.encrypt'?: string[];

  /**
   * Index paired with fields.encrypt to preserve what key is used to
   * encrypt/decrypt the value.
   */
  'fields.encrypt.secret'?: Buffer[];
}
