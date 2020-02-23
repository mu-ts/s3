import { Metadata } from '../model/Metadata';
import { Logger, LoggerService } from '@mu-ts/logger';

export class Registry {
  private static _i: Registry;

  private readonly logger: Logger;
  private readonly docs: { [key: string]: Metadata };

  private constructor() {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    this.docs = {};
    this.logger.info('init()');
  }

  /**
   *
   * @param name of the type to register data for.
   * @param change to apply to the stored data.
   */
  public static register(name: string, change: { [T in keyof Metadata]: Metadata[T] }): void {
    this.instance.logger.debug('log()', { name, change });

    if (!this.instance.docs[name]) this.instance.docs[name] = change;
    Object.keys(change).forEach((key: keyof Metadata) => {
      if (Array.isArray(this.instance.docs[name][key])) this.instance.docs[name][key] = (this.instance.docs[name][key] as any).concat(change[key]);
      else (this.instance.docs[name][key] as any) = change[key];
    });

    this.instance.logger.debug('log()', 'After application, registry is:', { name, registry: this.instance.docs[name] });
  }

  /**
   *
   * @param name of the type to get data for.
   */
  public static metadata<T>(type: T | string): Metadata | undefined {
    const name: string = typeof type === 'string' ? type : type.constructor.name;
    return this.instance.docs[name];
  }

  private static get instance() {
    if (!this._i) this._i = new Registry();
    return this._i;
  }
}
