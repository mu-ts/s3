import { Logger, LoggerService } from '@mu-ts/logger';

import { EncodeSerializer } from './utils/EncodeSerializer';
import { EncryptSerializer } from './utils/EncryptSerializer';
import { IgnoreSerializer } from './utils/IgnoreSerializer';
import { TagSerializer } from './utils/TagSerializer';
import { DecodeDeserializer } from './utils/DecodeDeserializer';
import { DateDeserializer } from './utils/DateDeserializer';
import { DecryptSerializer } from './utils/DecryptSerializer';

/**
 * Serializer that pays attention to the annotations provided to marshall the object
 * into a string that can be persisted.
 */
export class BodySerializer {

  private readonly logger: Logger;

  constructor() {
    this.logger = LoggerService.named(this.constructor.name);
    this.logger.debug('init()');
  }

  /**
   * 
   * @param object To be serialized
   * @param clazz to use for serialization instructions.
   * @returns 
   */
  public serialize<T>(object: object): string {
    if(this.logger.isTrace()) {
      this.logger.trace('serialize() -->', { object });
      this.logger.start('serialize');
    }

    const metadata: Record<string, any> | undefined = object.constructor['mu-ts'];

    const encryption: EncryptSerializer = new EncryptSerializer(metadata);
    const encoding: EncodeSerializer = new EncodeSerializer(metadata);
    const ignore: IgnoreSerializer = new IgnoreSerializer(metadata);
    const tags: TagSerializer = new TagSerializer(metadata);

    const serialized: string = JSON.stringify(
      object,
      (name: string, value: any) => {
        let newValue: any | undefined = ignore.serialize(name, value);

        newValue = tags.serializeBody(name, newValue);
        newValue = encryption.serialize(name, newValue);
        newValue = encoding.serialize(name, newValue);

        return newValue;
      }
    );

    if(this.logger.isTrace()) {
      this.logger.stop('serialize');
      this.logger.trace('serialize() <--', { serialized });
    }

    return serialized;
  }

  /**
   *
   * @param body to de-serialize into an object.
   * @param collection (optional) that this object will belong to.
   */
  public deserialize<T>(_body: string | Buffer, clazz?: any): T {
    if(this.logger.isTrace()) {
      this.logger.trace('deserialize() -->', { _body });
      this.logger.start('deserialize');
    }

    const body: string =  typeof _body === 'string' ? _body : _body.toString('utf8');

    /**
     * When there is no class or bucket, just parse without any interpretation.
     */
    if (!clazz) return JSON.parse(body);

    const metadata: Record<string, any> | undefined = clazz['mu-ts'];

    const decode: DecodeDeserializer = new DecodeDeserializer(metadata);
    const decrypt: DecryptSerializer = new DecryptSerializer(metadata);
    const date: DateDeserializer = new DateDeserializer(metadata);

    const deserialized: T = JSON.parse(body, (name: string, value: any) => {
      let newValue: any = decode.deserialize(name, value);
      newValue = decrypt.deserialize(name, newValue);
      newValue = date.deserialize(name, newValue);
      return newValue;
    }) as T;

    if(this.logger.isTrace()) {
      this.logger.stop('deserialize');
      this.logger.trace('deserialize() <--', { deserialized });
    }

    return deserialized;
  }
}