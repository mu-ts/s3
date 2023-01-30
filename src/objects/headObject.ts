import { HeadObjectCommand, HeadObjectCommandInput, HeadObjectCommandOutput  } from "@aws-sdk/client-s3";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";
import { Constructor } from "../guts/model/Constructor";
import { Logger } from "../utils/Logger";

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function headObject(id: string, bucket: Constructor, version?: string): Promise<Record<string, string> | undefined> {
  const input: HeadObjectCommandInput = {
    Bucket: BucketRegistry.getBucketName(bucket),
    Key: id,
    VersionId: version,
  }

  Logger.trace('headObject()', 'input', { input });

  const result: HeadObjectCommandOutput | undefined = await Client.instance().send(new HeadObjectCommand(input));

  Logger.trace('headObject()', 'output', { result });

  if (!result) return undefined;

  const metadata: Record<string, string> = result.Metadata || {};

  if (result.ETag) metadata['_etag'] = result.ETag as string;

  return metadata;
}