import { GetObjectCommand, GetObjectCommandInput, GetObjectOutput  } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function getObject<T extends Function>(id: string, bucket: T | string, version?: string): Promise<T> {
  const input: GetObjectCommandInput = {
    Bucket: BucketRegistry.getBucketName(bucket),
    Key: id,
    VersionId: version,
  }

  const results: GetObjectOutput = await Client.instance().send(new GetObjectCommand(input));
  const buffers = [];

  // node.js readable streams implement the async iterator protocol
  for await (const data of results.Body as Readable) {
    buffers.push(data);
  }

  const object: T = Client.instance().getSerializer().deserialize(Buffer.concat(buffers), bucket);

  return object;
}
