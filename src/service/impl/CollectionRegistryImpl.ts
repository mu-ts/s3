import { Logger, LoggerService } from '@mu-ts/logger';

import { Configuration } from '../Configuration';
import { Collection } from '../../model/Collection';
import { CollectionRegistry } from '../CollectionRegistry';

export class CollectionRegistryImpl extends CollectionRegistry {
  private readonly logger: Logger;
  private static registry: { [key: string]: Collection } = {};

  public constructor() {
    super();
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    this.logger.info('init()');
  }

  public register<T>(type: string | T, options: { [T in keyof Collection]: Collection[T] }): void {
    this.logger.debug('set()', { type, options });

    const name: string = this.nameFrom(type);

    if (!CollectionRegistryImpl.registry[name]) CollectionRegistryImpl.registry[name] = this.defaults(options);

    Object.keys(options).forEach((key: keyof Collection) => {
      if (Array.isArray(CollectionRegistryImpl.registry[name][key])) {
        const values: string[] = options[key] as string[];
        values.forEach((value: string) => (CollectionRegistryImpl.registry[name][key] as string[]).push(value));
      } else (CollectionRegistryImpl.registry[name][key] as any) = options[key];
    });

    this.logger.debug('set()', 'After application, registry is:', { name, registry: CollectionRegistryImpl.registry[name] });
  }

  /**
   *
   * @param type of the type to get data for.
   */
  public recall<T>(type: T | string): Collection | undefined {
    const name: string = this.nameFrom(type);
    const metadata: Collection | undefined = CollectionRegistryImpl.registry[name];

    this.logger.debug('get()', { type, name, metadata });

    return metadata;
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
