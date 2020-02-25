import { ServerSideEncryption } from 'aws-sdk/clients/s3';
import { Logger, LoggerService } from '@mu-ts/logger';
import { Configurations } from '@mu-ts/configurations';
import { Serializer } from '../model/Serialize';
import { Document } from '../model/Document';
import { Deserializer } from '../model/Deserialize';
import { createHash } from 'crypto';
import { IDGenerator } from '../model/IDGenerator';
import { MD5Generator } from '../model/MD5Generator';
import { Collection } from '../model/Collection';

export class Configuration {
  /**
   * Unique name to use across 'apps', in the same logical environment.
   */
  public readonly ROOT_NAME?: string = 'mu-ts-s3';

  /**
   * Pattern used to create the bucket name.
   * Stage is first to keep resources for the same 'environment' together.
   */
  public readonly BUCKET_NAME_PATTERN: string = 'STAGE.REGION.ROOT_NAME-type';

  /**
   * The environment or unique marker for the environment, used to group buckets together for the same logical stage.
   */
  public readonly STAGE?: string = process.env.STAGE || 'dev';

  /**
   * Sets server side ecnryption enabled for saved documents.
   */
  public readonly REGION?: string = process.env.AWS_REGION || process.env.REGION || 'us-east-1';

  /**
   * Sets server side ecnryption enabled for saved documents.
   */
  public readonly SERVER_SIDE_ENCRYPTION?: ServerSideEncryption = 'AES256';

  /**
   * How many results to return for each page during a list/find operation that
   * returns a series of document references.
   *
   * Default is 100.
   */
  public readonly PAGE_SIZE?: number = 100;

  /**
   * In situations where multiple attempts are made for the same operation, this value is
   * referenced.
   */
  public readonly RETRIES: number = 3;

  /**
   * Default timeout for interacting with S3. AWS S3 is defaulted to 120000 (2 mins)
   * but we reduce it to 20 seconds as our use cases are drastically simpler and need
   * to fail faster. This also fits within the 29 second timeout of API Gateway
   * with a little room to spare.
   */
  public readonly TIMEOUT: number = 20000;

  /**
   * The amount of time to wait to connect to S3 successfully. This only limits the connection phase and has
   * no impact once the socket has established a connection.
   */
  public readonly CONNECT_TIMEOUT: number = 5000;

  /**
   * The default function for generating UUID's.
   */
  // @ts-ignore
  public readonly ID_GENERATOR: IDGenerator = <T>(document: T, uuid: string) => uuid;

  /**
   * Default MD5 generation function.
   */
  public readonly MD5: MD5Generator = (body: string) =>
    createHash('md5')
      .update(body)
      .digest('base64');

  /**
   * Default
   */
  // @ts-ignore
  public readonly SERIALIZER: Serializer = <T>(object: T, collection: Collection, document: Document) =>
    JSON.stringify(
      object,
      (name: string, value: any) => {
        /* Filter out redacted fields. */
        if (collection.tag && collection.tag.includes(name)) return undefined;
        if (collection.ignore && collection.ignore.includes(name)) return undefined;
        return value;
      },
      undefined
    );

  /**
   * Default de-serializer.
   */
  // @ts-ignore
  public readonly DESERIALIZER: Deserializer = <T>(body: string, collection: Collection) => JSON.parse(body) as T;

  private static _i: Configuration;

  private readonly logger: Logger;
  private readonly configurations: { [T in keyof Configuration]?: Configuration[T] };

  private constructor() {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    this.configurations = {};
    this.logger.info('init()');
  }

  /**
   * S3 is a singleton, this makes accessing it much easier/neater.
   */
  private static get instance() {
    if (!this._i) this._i = new Configuration();
    return this._i;
  }

  /**
   *
   * @param name of the attribute to lookup in the coonfiguration.
   */
  public static get(name: keyof Configuration): string | number | Deserializer | Serializer | IDGenerator | MD5Generator {
    return this.instance.configurations[name] || this.instance[name];
  }

  /**
   *
   * @param configurations to lookup settings values in.
   */
  public static async update(configurations: Configurations): Promise<void> {
    this.instance.logger.debug('setting configurations for @mu-ts/S3.', 'configurations()', { configurations });
    for (const key in this.instance.configurations) {
      (this.instance.configurations as any)[key] = await configurations.get(key);
    }
  }

  /**
   *
   * @param options to overwrite the defaults with.
   */
  public static configure(options: { [T in keyof Configuration]: Configuration[T] }): void {
    this.instance.logger.debug('Updating configurations for @mu-ts/S3.', 'configure()', { options });
    for (let name in options) {
      if (!name || !options[name as keyof Configuration]) continue;
      const key: keyof Configuration = name as keyof Configuration;
      (this.instance.configurations as any)[key] = options[key];
    }
  }
}
