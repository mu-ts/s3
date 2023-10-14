import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  NoSuchBucket,
  NoSuchKey,
  NotFound,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import * as consumers from 'node:stream/consumers';

import { Client } from './guts/Client'
import { BucketService } from './guts/BucketService'
import { fromMetadata, fromString } from '@mu-ts/serialization'

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucketNameOrClass annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the serialized instance from the body and metadata
 */
export async function getObject<T>(id: string, bucketOrClazz: string | any, version?: string): Promise<T | undefined> {
  const bucketName: string = BucketService.getName(bucketOrClazz);

  const input: GetObjectCommandInput = {
    Bucket: bucketName,
    Key: id,
    VersionId: version,
  }

  try {
    const result: GetObjectCommandOutput = await Client.instance().send(new GetObjectCommand(input))

    if (!result.Body) return undefined;

    /**
     * Go through the metadata returned, if any of the keys match a configured attribute
     * that is set as a tag, then grab it, so it can be put back on the object.
     */
    const metadata: Record<string, any> = fromMetadata(result.Metadata, bucketOrClazz);

    /**
     * Constructing an instance of the underlying class will ensure that the
     * association to the bucket does not get lost.
     */
    const body: string = await consumers.text(result.Body as Readable)
    const object: any = fromString(body, bucketOrClazz)
    const instance: T = typeof bucketOrClazz === 'string'? {} : new bucketOrClazz()

    return { ...instance, ...object, ...metadata };

  } catch(error: unknown) {
    if (error instanceof NotFound || error instanceof NoSuchBucket || error instanceof NoSuchKey) {
      return undefined;
    }
    throw error;
  }
}
