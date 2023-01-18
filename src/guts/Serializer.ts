import { Cipher, createCipheriv, Decipher, createDecipheriv, randomBytes } from 'crypto';
import { AttributeConfiguration } from '../model/AttributeConfiguration';
import { BucketRegistry } from './BucketRegistry';

/**
 * Serializer that pays attention to the annotations provided to marshall the object
 * into a string that can be persisted.
 */
export class Serializer {
  private readonly dateRegex: RegExp;

  constructor() {
    this.dateRegex = new RegExp(/(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?/g);
  }

  /**
   *
   * @param object to serialize.
   * @param collection (optional) this object belongs to.
   * @param document (optional) attached to this object.
   */
  // @ts-ignore
  public serialize<T>(object: object, clazz: Function): string {
    const serialized: string = JSON.stringify(
      object,
      (name: string, value: any) => {
        /* Filter out redacted fields. */
        const attributes: AttributeConfiguration = BucketRegistry.getAttributes(clazz, name);

        if (attributes.ignored || attributes.tag) return undefined;
        
        let newValue: string = value;

        if (attributes.encoded) {
          const algorithm: BufferEncoding = attributes.encoding || 'hex';
          newValue = Buffer.from(value, 'utf8').toString(algorithm);
        }

        if (attributes.encrypted) {
          const secret: Buffer = Buffer.from(attributes.encryptSecret as string);
          const iv: Buffer = randomBytes(16);
          const cipher: Cipher = createCipheriv(attributes.encodingAlgorithm as string | 'aes-256-cbc', secret, null);
          const encrypted: Buffer = cipher.update(value);

          newValue = `${iv.toString('hex')}.${Buffer.concat([encrypted, cipher.final()]).toString('hex')}`;
        }

        return newValue;
      },
      undefined
    );
    return serialized;
  }

  /**
   *
   * @param body to de-serialize into an object.
   * @param collection (optional) that this object will belong to.
   */
  // @ts-ignore
  public deserialize<T>(body: string | Buffer, bucket: Function | string): T {
    const bucketName: string = BucketRegistry.getBucketName(bucket);

    const deserialized: T = JSON.parse(typeof body === 'string' ? body : body.toString('utf8'), (name: string, value: any) => {
      if (typeof value === 'string' && this.dateRegex.test(value)) return new Date(value);
      
      const attributes: AttributeConfiguration = BucketRegistry.getAttributes(bucketName, name);

      let newValue: string = value;

      if (attributes.encrypted) {
        const secret: Buffer = Buffer.from(attributes.encryptSecret as string);
        const [iv, value] = newValue.split('.');
        const cipher: Decipher = createDecipheriv(attributes.encodingAlgorithm as string | 'aes-256-cbc', secret, Buffer.from(iv, 'hex'));
        const decrypted: Buffer = cipher.update(Buffer.from(value, 'hex'));

        newValue = Buffer.concat([decrypted, cipher.final()]).toString('utf8');
      }

      if (attributes.encoded) {
        const algorithm: string = attributes.encoding || 'hex';
        newValue = Buffer.from(value, algorithm as BufferEncoding).toString('utf8');
      }

      return value;
    }) as T;

    return deserialized;
  }
}
