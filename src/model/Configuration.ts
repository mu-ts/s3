import { ServerSideEncryption } from 'aws-sdk/clients/s3';
import { Logger, LoggerService } from '@mu-ts/logger';
import { Configurations } from '@mu-ts/configurations';
import { v4 } from 'uuid';
import { Serialize } from './Serialize';
import { Document } from './Document';
import { Deserialize } from './Deserialize';

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
   * The default function for generating UUID's.
   */
  public readonly UUID: Function = v4;

  /**
   * Default
   */
  public readonly SERIALIZER: Serialize = (document: Document) => JSON.stringify(document, /* redact */ undefined);

  /**
   * Default de-serializer.
   */
  public readonly DESERIALIZER: Deserialize = (body: string) => JSON.parse(body);

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
  public static get(name: keyof Configuration): string | number | Function {
    this.instance.logger.debug('get()', { name, instance: this.instance });
    return this.instance.configurations[name] || this.instance[name];
  }

  /**
   * Returns an immutable reference to configurations. Can be used to retrieve the
   * current configuration values (not defaults), and will update appropriately
   * as the configurations are modified.
   */
  public static ref(): Configuration {
    return new Proxy<Configuration>(this.instance, {
      get: function(instance: Configuration, propName: keyof Configuration) {
        return instance.configurations[propName];
      },
      set: function() {
        throw new Error('Configurations returned via current() are immutable. Use .configure() instead.');
      },
    });
  }

  /**
   *
   * @param configurations to lookup settings values in.
   */
  public static async configurations(configurations: Configurations): Promise<void> {
    this.instance.logger.debug('setting configurations for @mu-ts/S3.', 'configurations()', { configurations });
    for (const key in this.configurations) {
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
