import { IDGenerator } from '../model/IDGenerator';
import { Configuration } from './Configuration';
import { Logger, LoggerService } from '@mu-ts/logger';

export class Collection {
  /**
   * Where to locate, or populate, the id for a document on an object mapped to the
   * type.
   */
  'id.name'?: string;

  /**
   * The value that will preceed any key, regardless of its generation strategy,
   * or the behavior utilized.
   */
  'id.prefix'?: string;

  /**
   * Function to execute when an ID needs to be generate for a document.
   */
  'id.generator'?: IDGenerator;

  /**
   * Bucket name for the type.
   */
  'bucket.name'?: string;

  /**
   * Fiels that will not be serialized but instead be converted
   * to tags on the document.
   */
  tag?: string[];

  /**
   * Fields that will be redacted, and not serialized nor tagged. Omitted completely from S3.
   */
  ignore?: string[];

  private static _i: Collection;

  private readonly logger: Logger;
  private readonly registery: { [key: string]: Collection };

  private constructor() {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    this.registery = {};
    this.logger.info('init()');
  }

  /**
   *
   * @param name of the type to register data for.
   * @param change to apply to the stored data.
   */
  public static set<T>(type: string | T, options: { [T in keyof Collection]: Collection[T] }): void {
    this.instance.logger.debug('set()', { type, options });

    const name: string = this.instance.nameFrom(type);

    if (!this.instance.registery[name]) this.instance.registery[name] = this.instance.defaults(options);

    Object.keys(options).forEach((key: keyof Collection) => {
      if (Array.isArray(this.instance.registery[name][key])) {
        const values: string[] = options[key] as string[];
        values.forEach((value: string) => (this.instance.registery[name][key] as string[]).push(value));
      } else (this.instance.registery[name][key] as any) = options[key];
    });

    this.instance.logger.debug('set()', 'After application, registry is:', { name, registry: this.instance.registery[name] });
  }

  /**
   *
   * @param name of the type to get data for.
   */
  public static get<T>(type: T | string): Collection | undefined {
    const name: string = this.instance.nameFrom(type);
    const metadata: Collection | undefined = this.instance.registery[name];

    this.instance.logger.debug('get()', { type, name, metadata });

    return metadata;
  }

  private static get instance() {
    if (!this._i) this._i = new Collection();
    return this._i;
  }

  /**
   *
   * @param options to apply in addition to default values, to the class type.
   */
  private defaults(options: { [T in keyof Collection]: Collection[T] }): Collection {
    return {
      ...{
        'id.name': 'id',
        'id.generator': Configuration.get('ID_GENERATOR'),
      },
      ...options,
    } as Collection;
  }

  /**
   *
   * @param type normalized into a string value.
   */
  private nameFrom<T>(type: T | string): string {
    return typeof type === 'string' ? type : (type as any).name || type.constructor.name;
  }
}
