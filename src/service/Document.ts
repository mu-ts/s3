import { Metadata as S3Metadata, LastModified, ContentLength, ETag, ObjectVersionId, ContentType } from 'aws-sdk/clients/s3';

export class Document {
  private static readonly PROPERTY_KEY = '__mu-ts-s3-metadata';
  /**
   * The md5 calculated at the time of the last s3 interaction. So on a get
   * the response generates an MD5. On an update, the response from an update
   * will result in an MD5 on the body sent over to S3.
   */
  'body.md5'?: string;

  /**
   * The most recent eTag returned from S3.
   */
  's3.ETag'?: ETag;

  /**
   * If versioning is enabled on the bucket, this will return the version ID of
   * return on the last response from S3.
   */
  's3.VersionId'?: ObjectVersionId;

  /**
   * The content type returned from S3.
   */
  's3.ContentType'?: ContentType;

  /**
   * The content length returned form S3.
   */
  's3.ContentLength'?: ContentLength;

  /**
   * The last modified, according to S3.
   */
  's3.LastModified'?: LastModified;

  /**
   * The 'metadata' returned from s3.
   */
  's3.Metadata'?: S3Metadata;

  private constructor() {}

  /**
   *
   * @param target
   * @param document
   */
  public static set(target: any, source: any): Document {
    const document: Document = new Document();
    for (const name in this) {
      const key: keyof Document = name as keyof Document;
      if (source[key]) (document[key] as any) = source[key];
    }
    Object.defineProperty(target, this.PROPERTY_KEY, { value: Object.freeze(document), writable: false });
    return Object.freeze(document);
  }

  /**
   *
   * @param target
   */
  public static get(target: any): Document {
    return target[this.PROPERTY_KEY] as Document;
  }
}
