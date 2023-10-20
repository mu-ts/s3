import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, PutObjectOutput  } from '@aws-sdk/client-s3'

import { Client } from './guts/Client'
import { MD5 } from './guts/MD5'
import { BucketService } from './guts/BucketService'
import { Diacritics, toMetadata, toString } from '@mu-ts/serialization'

/**
 * Retrieves an item from the bucket and serializes it into an object.
 * @param id of the item to delete.
 * @param bucket annotated object or name of the bucket.
 * @param version to delete (if provided).
 * @returns the version id (if returned) of the item deleted.
 */
export async function putObject<T extends object>(object: T, bucket?: string): Promise<T> {

  /**
   * Serialize the body, which will remove ignored and tagged fields and convert 
   * other fields based on the decorated values.
   */
  const body: string = toString(object)
  const key: string | undefined = BucketService.getId(body, object.constructor)

  /**
   * Need an @id decorator or a field appropriately named (id, key, _id, etc)
   */
  if (!key) throw new Error('No key could be determined while trying to save the object.')

  const md5: string = Diacritics.remove(MD5.generate(body))

  const _metadata: Record<string, string | string[]> = toMetadata(object);
  /**
   * Array is not supported by S3 metadata, so need to join any Array values together.
   */
  const metadata: Record<string, string> = Object.keys(_metadata).reduce((accumulator: Record<string, string>, key: string) => {
    const value: string | string[] = _metadata[key]
    if(Array.isArray(value)) accumulator[key] = value.join(',')
    else accumulator[key] = value
    return accumulator;
  }, {})
  metadata['Content-Length'] = `${body.length}`
  metadata['MD5'] = md5
  metadata['mu-ts'] = 'true'

  const bucketName: string = BucketService.getName(object) || bucket
  const input: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    Metadata: metadata
  }

  /**
   * No failure means success, for now.
   */
  const output: PutObjectCommandOutput = await Client.instance().send(new PutObjectCommand(input))
  const { ETag, VersionId, ServerSideEncryption } = output;

  /**
   * Presuming this object is decorated with @bucket add on some S3 metadata that
   * will be useful.
   */
  BucketService.setMetadata(object, { ETag, VersionId, ServerSideEncryption, MD5: md5 })
  
  return object
}



