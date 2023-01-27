import { DeleteObjectCommandInput, DeleteObjectCommand, DeleteObjectCommandOutput  } from "@aws-sdk/client-s3";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";

/**
 * Removes an item from the bucket.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function deleteObject(id: string, bucket: Function | string, version?: string): Promise<string | undefined> {
  const input: DeleteObjectCommandInput = {
    Bucket: BucketRegistry.getBucketName(bucket),
    Key: id,
    VersionId: version,
  }

  const results: DeleteObjectCommandOutput = await Client.instance().send(new DeleteObjectCommand(input));

  return results.VersionId;
}
