import { DeleteObjectCommandInput, DeleteObjectCommand, DeleteObjectCommandOutput  } from "@aws-sdk/client-s3";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";
import { Constructor } from "../guts/model/Constructor";
import { Logger } from "../utils/Logger";

/**
 * Removes an item from the bucket.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function deleteObject(id: string, bucket: Constructor, version?: string): Promise<string | undefined> {
  const input: DeleteObjectCommandInput = {
    Bucket: BucketRegistry.getBucketName(bucket),
    Key: id,
    VersionId: version,
  }
  Logger.trace('deleteObject()', 'input', { input });
  const results: DeleteObjectCommandOutput = await Client.instance().send(new DeleteObjectCommand(input));
  Logger.trace('deleteObject()', 'output', { results });
  return results.VersionId;
}