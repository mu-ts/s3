import {
  HeadObjectCommand,
  HeadObjectCommandInput,
  HeadObjectCommandOutput,
  NoSuchBucket,
  NoSuchKey,
  NotFound
} from "@aws-sdk/client-s3";

import { Client } from "../guts/Client";
import { BucketService } from "../guts/BucketService";

/**
 * Lightweight check to see if the object exists, without having to load the whole object.
 *
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function existsObject(id: string, bucketOrObject: string | any, version?: string): Promise<boolean> {
  const input: HeadObjectCommandInput = {
    Bucket: BucketService.getName(bucketOrObject),
    Key: id,
    VersionId: version,
  }

  try {
    const output: HeadObjectCommandOutput | undefined = await Client.instance().send(new HeadObjectCommand(input));
    return !!(output);
  } catch (error: unknown) {
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