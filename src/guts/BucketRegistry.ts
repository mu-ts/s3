import { Logger } from '../utils/Logger';
import { AttributeConfiguration } from './model/AttributeConfiguration';
import { Constructor } from './model/Constructor';
import { IDGenerator } from './model/IDGenerator';
import { UUIDV5 } from './model/UUIDV5';
interface ClazzRegistry {
  constructor?: Constructor;
  bucketName: string;
  idAttribute: string;
  idStrategy: string | IDGenerator | UUIDV5;
  attributes: Record<string, AttributeConfiguration>;
}

export class BucketRegistry {
  private static _instance: BucketRegistry;

  private readonly ledger: Record<string, ClazzRegistry>;

  private constructor() {
    this.ledger = {};
  }

  public static register(clazz: Function, bucket: string): void {
    Logger.trace('register()', { clazz, bucket });
    const registry: ClazzRegistry = this.registry(clazz);
    registry.bucketName = bucket;
    registry.constructor = clazz.constructor as Constructor;
  }

  public static getClazz(bucketName: string): Constructor | undefined {
    Logger.trace('getClazz()', { bucketName });
    const clazz: string | undefined = Object.keys(this.instance().ledger).find((key: string) => this.instance().ledger[key].bucketName === bucketName );
    if (!clazz) return undefined;
    const registry: ClazzRegistry = this.instance().ledger[clazz];
    return registry.constructor!;
  }

  public static getBucketName(clazz: Function | string): string {
    Logger.trace('getBucketName()', { type: typeof clazz, clazz });
    if (typeof clazz === 'string') return clazz;
    const registry: ClazzRegistry = this.registry(clazz);
    Logger.trace('getBucketName()', { registry });
    return registry.bucketName;
  }

  public static setAttributes(clazz: Function, attributeName: string, values: AttributeConfiguration): void {
    Logger.trace('setAttributes()', { clazz, attributeName, values });
    const registry: ClazzRegistry = this.registry(clazz);
    const attribute: AttributeConfiguration = registry.attributes[attributeName] || {};
    registry.attributes[attributeName] = { ...attribute, ...values };
  }

  public static getAttributes(clazz: Function, attributeName: string): AttributeConfiguration {
    Logger.trace('getAttributes()', { clazz, attributeName });
    const registry: ClazzRegistry = this.registry(clazz);
    const attribute: AttributeConfiguration = registry.attributes[attributeName] || {};
    return attribute;
  }

  public static setId(clazz: Function, attributeName: string, config: string | IDGenerator | UUIDV5) {
    const registry: ClazzRegistry = this.registry(clazz);
    registry.idAttribute = attributeName;
    registry.idStrategy = config;
  }

  public static getId(clazz: Function): { attribute: string, strategy?: string | IDGenerator | UUIDV5 } {
    const registry: ClazzRegistry = this.registry(clazz);
    const { idAttribute , idStrategy } = registry;
    return {
      attribute: idAttribute,
      strategy: idStrategy,
    }
  }

  private static registry(clazz: Function | Constructor): ClazzRegistry {
    Logger.trace('registry()', { clazz });
    const name: string = clazz.name || clazz.constructor.name;
    if (!this.instance().ledger[name]) this.instance().ledger[name] = {
      bucketName: name, 
      attributes: {}, 
      idAttribute: 'id', 
      idStrategy: 'uuid'
    } as ClazzRegistry;
    return this.instance().ledger[name];
  }

  private static instance() {
    if (this._instance) return this._instance;
    this._instance = new BucketRegistry();
    return this._instance;
  }
}

