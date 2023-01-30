import { HeadObjectCommand, HeadObjectCommandInput, HeadObjectCommandOutput  } from "@aws-sdk/client-s3";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";
import { Constructor } from "../guts/model/Constructor";
import { Logger } from "../utils/Logger";

/**
 * Lightweight check to see if the object exists, without having to load the whole object.
 *
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function existsObject(id: string, bucket: Constructor, version?: string): Promise<boolean> {
  const input: HeadObjectCommandInput = {
    Bucket: BucketRegistry.getBucketName(bucket),
    Key: id,
    VersionId: version,
  }

  Logger.trace('existsObject()', 'input', { input });
  const result: HeadObjectCommandOutput | undefined = await Client.instance().send(new HeadObjectCommand(input));
  Logger.trace('existsObject()', 'output', { result });

  if (!result) return false;

  return true;
}