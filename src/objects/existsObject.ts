import {
  HeadObjectCommand,
  HeadObjectCommandInput,
  HeadObjectCommandOutput,
  NoSuchBucket,
  NoSuchKey,
  NotFound
} from "@aws-sdk/client-s3";
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

  try {
    Logger.trace('existsObject()', 'input', { input });
    const output: HeadObjectCommandOutput | undefined = await Client.instance().send(new HeadObjectCommand(input));
    Logger.trace('existsObject()', 'output', { output });
    return !!(output);
  } catch (error: unknown) {
    Logger.trace('existsObject()', 'Error', { error });
    /*
     * If the bucket does not exist, or you do not have permission to access it,
     * the HEAD request returns a generic 400 Bad Request, 403 Forbidden or 404 Not Found code.
     * A message body is not included, so you cannot determine the exception beyond these error codes.
     */
    if (error instanceof NotFound || error instanceof NoSuchBucket || error instanceof NoSuchKey) {
      return false;
    }
    throw error;
  }
}