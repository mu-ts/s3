import { Metadata as S3Metadata, LastModified, ContentLength, ETag, ObjectVersionId, ContentType } from 'aws-sdk/clients/s3';

export interface Document {
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
}
