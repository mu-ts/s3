import { PutObjectCommand, PutObjectCommandInput, PutObjectOutput  } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";
import { Diacritics } from "../guts/Diacritics";
import { ID } from "../guts/ID";
import { MD5 } from "../guts/MD5";
import { Constructor } from "../guts/model/Constructor";
import { Tagged } from "../guts/Tagged";
import { Logger } from "../utils/Logger";

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function putObject<T extends object>(object: T, _clazz?: Constructor | string): Promise<T> {
  
  
  const bucketName: string = BucketRegistry.getBucketName(_clazz || object.constructor);
  const clazz: Function = (typeof _clazz !== 'string' ? _clazz : object.constructor);
  const { attribute, strategy } = BucketRegistry.getId(clazz);
  const id: string = ID.generate(bucketName, object, attribute, strategy ).toString();

  /**
   * Set the ID before persisting.
   */
  (object as any)[attribute] = id;

  /**
   * Serialize the object (which supports decoration of classes)
   * before sending to S3.
   */
  const body: string = Client.instance().getSerializer().serialize(object, clazz);
  const metadata: Record<string, string> = Tagged.tags(object, clazz) || {};

  metadata['mu-ts'] = 'true';
  metadata['Content-Length'] = `${body.length}`;
  metadata['MD5'] = Diacritics.remove(MD5.generate(body));

  const input: PutObjectCommandInput = {
    Bucket: BucketRegistry.getBucketName(object as Function),
    Key: id,
    Body: body,
    Metadata: metadata
  }

  Logger.trace('putObject()', 'input', { input });

  /**
   * No failure means success, for now.
   */
  await Client.instance().send(new PutObjectCommand(input));
  
  Logger.trace('putObject()', 'output', { object });

  return object;
}
