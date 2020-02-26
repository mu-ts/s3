import { SerializerServices } from '../SerializerService';
import { Collection } from '../../model/Collection';
import { Document } from '../../model/Document';
import { Cipher, createCipheriv, Decipher, createDecipheriv, randomBytes } from 'crypto';

/**
 * Serializer that pays attention to the annotations provided to marshall the object
 * into a string that can be persisted.
 */
export class JSONSerializerService implements SerializerServices {
  private readonly dateRegex: RegExp;
  private readonly encryptAlgoirthm: string;

  constructor() {
    this.dateRegex = new RegExp(/(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?/g);
    this.encryptAlgoirthm = 'aes-256-cbc';
  }

  /**
   *
   * @param object to serialize.
   * @param collection (optional) this object belongs to.
   * @param document (optional) attached to this object.
   */
  // @ts-ignore
  public serialize<T>(object: T, collection?: Collection, document?: Document): string {
    const serialized: string = JSON.stringify(
      object,
      (name: string, value: any) => {
        /* Filter out redacted fields. */
        if (collection) {
          if (collection['fields.tag'] && collection['fields.tag'].includes(name)) return undefined;
          if (collection['fields.ignore'] && collection['fields.ignore'].includes(name)) return undefined;

          let newValue: any = value;

          if (collection['fields.encrypt'] && collection['fields.encrypt'].includes(name)) {
            const index: number = collection['fields.encrypt'].indexOf(name);
            const secret: Buffer = collection['fields.encrypt.secret'][index];
            const iv: Buffer = randomBytes(16);
            const cipher: Cipher = createCipheriv(this.encryptAlgoirthm, secret, iv);
            const encrypted: Buffer = cipher.update(value);

            newValue = `${iv.toString('hex')}.${Buffer.concat([encrypted, cipher.final()]).toString('hex')}`;
          }

          if (collection['fields.encode'] && collection['fields.encode'].includes(name)) {
            const index: number = collection['fields.encode'].indexOf(name);
            const algorithm: string = collection['fields.encode.algorithm'][index] || 'hex';

            newValue = Buffer.from(value, 'utf8').toString(algorithm);
          }

          return newValue;
        }
        return value;
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
  public deserialize<T>(body: string, collection?: Collection): T {
    // @ts-ignore
    const deserialized: T = JSON.parse(body, (name: string, value: any) => {
      if (typeof value === 'string' && this.dateRegex.test(value)) return new Date(value);
      if (collection) {
        let newValue: any = value;

        if (collection['fields.encode'] && collection['fields.encode'].includes(name)) {
          const index: number = collection['fields.encode'].indexOf(name);
          const algorithm: string = collection['fields.encode.algorithm'][index] || 'hex';

          newValue = Buffer.from(value, algorithm as BufferEncoding).toString('utf8');
        }

        if (collection['fields.encrypt'] && collection['fields.encrypt'].includes(name)) {
          const index: number = collection['fields.encrypt'].indexOf(name);
          const secret: Buffer = collection['fields.encrypt.secret'][index];
          const iv: Buffer = Buffer.from(newValue.split('.')[0], 'hex');
          const encrypted: Buffer = Buffer.from(newValue.split('.')[1], 'hex');
          const cipher: Decipher = createDecipheriv(this.encryptAlgoirthm, secret, iv);
          const decrypted: Buffer = cipher.update(encrypted);

          newValue = Buffer.concat([decrypted, cipher.final()]).toString('utf8');
        }

        return newValue;
      }
      return value;
    }) as T;
    return deserialized;
  }
}

// @collection()
// class User {
//   age: Date;
//   id: string;
//   @encode()
//   name: string;
//   @encrypt(randomBytes(32))
//   notes: string;
// }
// const user: User = new User();
// user.age = new Date();
// user.id = '1234';
// user.name = 'John Doe';
// user.notes = "I'm not happy with this person at all";

// console.log('before', user);

// const service: JSONSerializerService = new JSONSerializerService();
// const collectionRegistry: CollectionRegistry = new CollectionRegistryImpl();
// const usersCollection: Collection = collectionRegistry.recall(User);
// const serialized: string = service.serialize(user, usersCollection);

// console.log('serialized', serialized);

// console.log('after', service.deserialize(serialized, usersCollection));
