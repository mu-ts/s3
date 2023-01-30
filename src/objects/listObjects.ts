import { ListObjectsV2Command, ListObjectsV2CommandInput, ListObjectsV2CommandOutput, _Object  } from "@aws-sdk/client-s3";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";
import { Objects } from "./model/Objects";
import { ObjectKey } from "./model/ObjectKey";
import { Logger } from "../utils/Logger";
import { Constructor } from "../guts/model/Constructor";

/**
 * Used to iterate over the contents of a bucket, or locate a series of documents that 
 * are similarly named.
 * 
 * @param bucket to locate the objects within.
 * @param prefix on the key used to restrict the results by.
 * @param size of the pages.
 * @param continuationToken to resume to the next batch of objects.
 * @returns 
 */
export async function listObjects(bucket: Constructor, prefix?: string, size?: number, continuationToken?: string): Promise<Objects | undefined> {
  const pageSize: number = size || 100;
  const bucketName: string = BucketRegistry.getBucketName(bucket);

  const input: ListObjectsV2CommandInput = {
    Bucket: BucketRegistry.getBucketName(bucket),
    Prefix: prefix,
    ContinuationToken: continuationToken,
    MaxKeys: pageSize,
  }

  Logger.trace('listObjects()', 'input', { input });

  const output: ListObjectsV2CommandOutput | undefined = await Client.instance().send(new ListObjectsV2Command(input));
  
  Logger.trace('listObjects()', 'output', { output });

  if (!output || !output.Contents) return undefined;

  const results: ObjectKey[] = output.Contents.map(({Key, LastModified, Size, ETag }: _Object) => new ObjectKey(bucketName, Key as string, LastModified as Date, Size as number, ETag as string))

  return new Objects(output.KeyCount as number, pageSize, results, output.Prefix as string, output.NextContinuationToken as string);
}