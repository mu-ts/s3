import { GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput  } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { BucketRegistry } from "../guts/BucketRegistry";
import { Client } from "../guts/Client";
import { Tagged } from "../guts/Tagged";
import { Constructor } from "../guts/model/Constructor";
import { AttributeConfiguration } from "../guts/model/AttributeConfiguration";

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function getObject<T extends Function>(id: string, bucket: T | string, version?: string): Promise<T | undefined> {
  const input: GetObjectCommandInput = {
    Bucket: BucketRegistry.getBucketName(bucket),
    Key: id,
    VersionId: version,
  }

  try {
    const result: GetObjectCommandOutput = await Client.instance().send(new GetObjectCommand(input));

    if (!result.Body) return undefined;

    const buffers = [];

    // node.js readable streams implement the async iterator protocol
    for await (const data of result.Body as Readable) {
      buffers.push(data);
    }

    /**
     * Go through the metadata returned, if any of the keys match a configured attribute
     * that is set as a tag, then grab it so it can be put back on the object.
     */
    const tags: Record<string, string> = result.Metadata ? 
      Object.keys(result.Metadata)
        .filter((key:string) => result.Metadata![key] !== undefined)
        .map((key:string) => ({key, config: BucketRegistry.getAttributes(bucket, key)}))
        .filter(({ config }: {key: string, config?: AttributeConfiguration}) => config !== undefined && config.tag)
        .reduce((accumulator: Record<string, string>, { key }: { key: string }) => {
          accumulator[key] = result.Metadata![key];
          return accumulator;
        }, {})
      : {};

    /**
     * Constructing an instance of the underlying class will ensure that the
     * association to the bucket does not get lost.
     */
    const object: any = Client.instance().getSerializer().deserialize(Buffer.concat(buffers), bucket);
    const constructor: Constructor = BucketRegistry.getConstructor(bucket);
    const instance: T = new constructor();

    return { ...instance, ...object, ...tags };

  } catch(error: any) {
    if (error.code === 'NoSuchKey') return undefined;
    throw error;
  }
}
