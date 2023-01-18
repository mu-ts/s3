// import { HeadObjectCommandInput, HeadObjectCommand, HeadObjectOutput  } from "@aws-sdk/client-s3";
// import { client, preRequest } from '../utils/configure';

// export async function headObject(input: Partial<HeadObjectCommandInput>): Promise<HeadObjectOutput> {
//   preRequest(input);
  
//   const command: HeadObjectCommand = new HeadObjectCommand(input as HeadObjectCommandInput);
//   const response: HeadObjectOutput = await client.send(command);

//   return response;
// }

import { HeadObjectCommand, HeadObjectOutput, HeadObjectCommandInput  } from "@aws-sdk/client-s3";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function getObject<T extends Function>(id: string, bucket: T | string, version?: string): Promise<Record<string, string> | undefined> {
  const input: HeadObjectCommandInput = {
    Bucket: BucketRegistry.getBucketName(bucket),
    Key: id,
    VersionId: version,
  }

  const result: HeadObjectOutput | undefined = await Client.instance().send(new HeadObjectCommand(input));

  if (!result) return undefined;

  const metadata: Record<string, string> = result.Metadata || {};

  if (result.ETag) metadata['_etag'] = result.ETag as string;

  return metadata;
}