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
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";
import { Constructor } from "../guts/model/Constructor";
import { AttributeConfiguration } from "../guts/model/AttributeConfiguration";
import { Logger } from "../utils/Logger";
import consumers from 'node:stream/consumers'

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param _clazz annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function getObject<T>(id: string, _clazz: Constructor, version?: string): Promise<T | undefined> {
  const bucketName: string = BucketRegistry.getBucketName(_clazz);
  const clazz: Constructor | undefined = BucketRegistry.getClazz(bucketName);

  const input: GetObjectCommandInput = {
    Bucket: bucketName,
    Key: id,
    VersionId: version,
  }

  try {
    Logger.trace('getObject()', 'input', { input });
    const result: GetObjectCommandOutput = await Client.instance().send(new GetObjectCommand(input));
    Logger.trace('getObject()', 'result', { result });

    if (!result.Body) return undefined;

    /**
     * Go through the metadata returned, if any of the keys match a configured attribute
     * that is set as a tag, then grab it, so it can be put back on the object.
     */
    const tags: Record<string, string> = result.Metadata && clazz ?
        Object.keys(result.Metadata)
            .filter((key:string) => result.Metadata![key] !== undefined)
            .map((key:string) => ({key, config: BucketRegistry.getAttributes(clazz, key)}))
            .filter(({ config }: {key: string, config?: AttributeConfiguration}) => config !== undefined && config.tag)
            .reduce((accumulator: Record<string, string>, { key }: { key: string }) => {
              accumulator[key] = result.Metadata![key];
              return accumulator;
            }, {})
        : {};

    /**
     * Constructing an instance of the underlying class will ensure that the
     * association to the bucket does not get lost.
     */
    const object: any = await consumers.json(result.Body as Readable)
    const instance: T = clazz ? new clazz() : {};

    Logger.trace('getObject()', 'created object', { instance, object, tags });
    return { ...instance, ...object, ...tags };

  } catch(error: unknown) {
    Logger.trace('getObject()', 'Error', { error });

    if (error instanceof NotFound || error instanceof NoSuchBucket || error instanceof NoSuchKey) {
      return undefined;
    }
    const { name, message, $metadata } = error as S3ServiceException;
    throw new Error(`${name}: ${message} [${$metadata.requestId}]`);
  }
}
