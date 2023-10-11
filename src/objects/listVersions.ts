import { ListObjectVersionsCommand, ListObjectVersionsCommandInput, ListObjectVersionsCommandOutput, ObjectVersion  } from "@aws-sdk/client-s3";

import { Client } from "../guts/Client";
import { Objects } from "./model/Objects";
import { ObjectKey } from "./model/ObjectKey";
import { Constructor } from "../guts/model/Constructor";
import { BucketService } from "../guts/BucketService";

/**
 * Used to iterate over the contents of a bucket, or locate a series of documents that 
 * are similarly named.
 * 
 * @param bucket to locate the objects within.
 * @param prefix on the key used to restrict the results by.
 * @param size of the pages.
 * @param continuationToken to resume to the next batch of objects (known as KeyMarker for version listing)
 * @returns 
 */
export async function listVersions<T extends Function>(bucketOrObject: string | any, prefix?: string, size?: number, continuationToken?: string): Promise<Objects | undefined> {
  const pageSize: number = size || 100;
  const bucketName: string = BucketService.getName(bucketOrObject);

  const input: ListObjectVersionsCommandInput = {
    Bucket: bucketName,
    Prefix: prefix,
    KeyMarker: continuationToken,
    MaxKeys: pageSize,
  }

  const output: ListObjectVersionsCommandOutput | undefined = await Client.instance().send(new ListObjectVersionsCommand(input));
  
  if (!output || !output.Versions) return undefined;

  const results: ObjectKey[] = output.Versions.map(({Key, LastModified, Size, ETag, VersionId }: ObjectVersion) => new ObjectKey(bucketName, Key as string, LastModified as Date, Size as number, ETag as string, VersionId))

  return new Objects(results.length, pageSize, results, output.Prefix as string, output.NextKeyMarker as string);
}