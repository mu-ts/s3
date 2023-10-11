import { PutObjectCommand, PutObjectCommandInput, PutObjectOutput  } from "@aws-sdk/client-s3";

import { Client } from "../guts/Client";
import { Diacritics } from "../guts/Diacritics";
import { MD5 } from "../guts/MD5";
import { BucketService } from "../guts/BucketService";
import { BodySerializer } from "../guts/BodySerializer";
import { MetadataSerializer } from "../guts/MetadataSerializer";

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function putObject<T extends object>(object: T, bucket?: string): Promise<T> {

  /**
   * Set and get the Key so we can persist to a known location. This method
   * mutates the object as appropriate to ensure the ID decorated field gets updated
   * appropriately.
   */
  const key: string = BucketService.setKey(object);

  /**
   * Serialize the body, which will remove ignored and tagged fields and convert 
   * other fields based on the decorated values.
   */
  const bodySerializer: BodySerializer = new BodySerializer();
  const body: string = bodySerializer.serialize(object);

  const metadataSerializer: MetadataSerializer = new MetadataSerializer();
  const metadata: Record<string, string> = metadataSerializer.serialize(object)
  metadata['Content-Length'] = `${body.length}`;
  metadata['MD5'] = Diacritics.remove(MD5.generate(body));
  metadata['mu-ts'] = 'true';

  const bucketName: string = BucketService.getName(object) || bucket;
  const input: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    Metadata: metadata
  }

  /**
   * No failure means success, for now.
   */
  await Client.instance().send(new PutObjectCommand(input));
  
  return object;
}


