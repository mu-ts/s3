import { Logger, LoggerService } from '@mu-ts/logger';

import { Configuration } from './Configuration';
import { Collection } from '../model/Collection';

export class CollectionRegistry {
  private static _i: CollectionRegistry;

  private readonly logger: Logger;
  private readonly registery: { [key: string]: Collection };

  private constructor() {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    this.registery = {};
    this.logger.info('init()');
  }

  /**
   *
   * @param type of data to register for.
   * @param options to apply to the stored data.
   */
  public register<T>(type: string | T, options: { [T in keyof Collection]: Collection[T] }): void {
    this.logger.debug('set()', { type, options });

    const name: string = this.nameFrom(type);

    if (!this.registery[name]) this.registery[name] = this.defaults(options);

    Object.keys(options).forEach((key: keyof Collection) => {
      if (Array.isArray(this.registery[name][key])) {
        const values: string[] = options[key] as string[];
        values.forEach((value: string) => (this.registery[name][key] as string[]).push(value));
      } else (this.registery[name][key] as any) = options[key];
    });

    this.logger.debug('set()', 'After application, registry is:', { name, registry: this.registery[name] });
  }

  /**
   *
   * @param type of the type to get data for.
   */
  public recall<T>(type: T | string): Collection | undefined {
    const name: string = this.nameFrom(type);
    const metadata: Collection | undefined = this.registery[name];

    this.logger.debug('get()', { type, name, metadata });

    return metadata;
  }

  /**
   *
   */
  public static get instance() {
    if (!this._i) this._i = new CollectionRegistry();
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
