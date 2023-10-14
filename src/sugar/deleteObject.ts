import { DeleteObjectCommandInput, DeleteObjectCommand, DeleteObjectCommandOutput  } from '@aws-sdk/client-s3';

import { Client } from './guts/Client';
import { BucketService } from './guts/BucketService';

/**
 * Removes an item from the bucket.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function deleteObject(id: string, bucketOrObject: string | any, version?: string): Promise<string | undefined> {
  const input: DeleteObjectCommandInput = {
    Bucket: BucketService.getName(bucketOrObject),
    Key: id,
    VersionId: version,
  }
  const results: DeleteObjectCommandOutput = await Client.instance().send(new DeleteObjectCommand(input));
  return results.VersionId;
}