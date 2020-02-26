import { Metadata } from 'aws-sdk/clients/s3';

export interface Header {
  Key: string;
  LastModified?: Date;
  Size?: number;
  ContentLength?: number;
  ETag?: string;
  ContentType?: string;
  Metadata?: Metadata;
}
