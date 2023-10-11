import { Logger, LoggerService } from '@mu-ts/logger';
import { TagSerializer } from './utils/TagSerializer';
import { Diacritics } from './Diacritics';
import { TagDeserializer } from './utils/TagDeserializer';


/**
 * Serializer that pays attention to the annotations provided to marshall the object
 * into a string that can be persisted.
 */
export class MetadataSerializer {

  private readonly logger: Logger;

  constructor() {
    this.logger = LoggerService.named(this.constructor.name);
    this.logger.debug('init()');
  }

  /**
   * 
   * @param object To be serialized into Tags.
   * @returns 
   */
  public serialize<T>(object: object): Record<string, string> {
    if(this.logger.isTrace()) {
      this.logger.trace('serialize() -->', { object });
      this.logger.start('serialize');
    }

    const classMetadata: Record<string, any> | undefined = object.constructor['mu-ts'];
    const tags: TagSerializer = new TagSerializer(classMetadata);
    const metadata: Record<string, string> = Object
      .keys(object)
      .filter((key: string) => typeof object[key] === 'string')
      .reduce((accumulator: Record<string, string>, field: string) => {
        accumulator[field] = tags.serializeMetadata(field, object[field]);
        if (accumulator[field]) accumulator[field] = Diacritics.remove(accumulator[field]);
        return accumulator;
      }, {})

    if(this.logger.isTrace()) {
      this.logger.stop('serialize');
      this.logger.trace('serialize() <--', { metadata });
    }

    return metadata;
  }

  /**
   *
   * @param body to de-serialize into an object.
   * @param collection (optional) that this object will belong to.
   */
  public deserialize<T>(metadata: Record<string, string>, clazz?: any): Record<string, any> {
    if(this.logger.isTrace()) {
      this.logger.trace('deserialize() -->', { metadata, clazz });
      this.logger.start('deserialize');
    }

    /**
     * When there is no class or bucket, just parse without any interpretation.
     */
    if (!clazz) return {};

    const classMetadata: Record<string, any> | undefined = clazz['mu-ts'];
    const tags: TagDeserializer = new TagDeserializer(classMetadata);
    
    const deserialized: Record<string, string> = Object
      .keys(metadata)
      .reduce((accumulator: Record<string, string>, field: string) => {
        accumulator[field] = tags.deserializeMetadata(field, metadata[field]);
        return accumulator;
      }, {})

    if(this.logger.isTrace()) {
      this.logger.stop('deserialize');
      this.logger.trace('deserialize() <--', { deserialized });
    }

    return deserialized;
  }
}