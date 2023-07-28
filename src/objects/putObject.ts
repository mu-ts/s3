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
export async function putObject<T extends object>(object: T, clazz?: Constructor): Promise<T> {
  Logger.trace('putObject()', '-->', { object, clazz });

  const bucketName: string = BucketRegistry.getBucketName(clazz || object.constructor);
  Logger.trace('putObject()', { bucketName });

  /**
   * Set the ID before persisting.
   */
  const { attribute, strategy } = BucketRegistry.getId(clazz || object.constructor) || {};
  const id: string = ID.generate(bucketName, object, attribute, strategy ).toString();
  (object as any)[attribute] = id;

  Logger.trace('putObject()', { attribute, strategy, id });

  /**
   * Do body serialization as the very last thing so that any above mutation is properly reflected.
   */
  const body: string = Client.instance().getSerializer().serialize(object, clazz);

  const metadata: Record<string, string> = Tagged.tags(object, clazz || object.constructor) || {};
  metadata['Content-Length'] = `${body.length}`;
  metadata['MD5'] = Diacritics.remove(MD5.generate(body));
  metadata['mu-ts'] = 'true';
  Logger.trace('putObject()', { metadata });

  const input: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: id,
    Body: body,
    Metadata: metadata
  }
  Logger.trace('putObject()', 'input -->', { input });

  /**
   * No failure means success, for now.
   */
  await Client.instance().send(new PutObjectCommand(input));
  
  Logger.trace('putObject()', '<-- output', { object });

  return object;
}


