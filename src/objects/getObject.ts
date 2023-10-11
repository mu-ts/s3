import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  NoSuchBucket,
  NoSuchKey,
  NotFound,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as consumers from 'node:stream/consumers';

import { Client } from "../guts/Client";
import { BucketService } from "../guts/BucketService";
import { MetadataSerializer } from "../guts/MetadataSerializer";

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucketNameOrClass annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function getObject<T>(id: string, bucketOrClazz: string | any, version?: string): Promise<T | undefined> {
  const bucketName: string = BucketService.getName(bucketOrClazz);

  const input: GetObjectCommandInput = {
    Bucket: bucketName,
    Key: id,
    VersionId: version,
  }

  try {
    const result: GetObjectCommandOutput = await Client.instance().send(new GetObjectCommand(input));

    if (!result.Body) return undefined;

    /**
     * Go through the metadata returned, if any of the keys match a configured attribute
     * that is set as a tag, then grab it, so it can be put back on the object.
     */
    const metadataDeserializer: MetadataSerializer = new MetadataSerializer();
    const metadata: Record<string, any> = metadataDeserializer.deserialize(result.Metadata, bucketOrClazz);

    /**
     * Constructing an instance of the underlying class will ensure that the
     * association to the bucket does not get lost.
     */
    const object: any = await consumers.json(result.Body as Readable)
    const instance: T = typeof bucketOrClazz === "string"? {} : new bucketOrClazz();

    return { ...instance, ...object, ...metadata };

  } catch(error: unknown) {

    if (error instanceof NotFound || error instanceof NoSuchBucket || error instanceof NoSuchKey) {
      return undefined;
    }
    const { name, message, $metadata } = error as S3ServiceException;
    throw new Error(`${name}: ${message} [${$metadata.requestId}]`);
  }
}
