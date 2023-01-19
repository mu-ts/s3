import { AttributeConfiguration } from './model/AttributeConfiguration';
import { Constructor } from './model/Constructor';
import { IDGenerator } from './model/IDGenerator';
import { UUIDV5 } from './model/UUIDV5';


type RegistryValue = string | IDGenerator | UUIDV5 | AttributeConfiguration | Constructor;

export class BucketRegistry {
  private static _instance: BucketRegistry;

  private readonly ledger: Record<string, Record<string, RegistryValue>>;

  private constructor() {
    this.ledger = {};
  }

  private static instance() {
    if (this._instance) return this._instance;
    this._instance = new BucketRegistry();
    return this._instance;
  }

  public static register(clazz: Function, bucket: string): void {
    this.instance().ledger[clazz.constructor.name] = { bucket, constructor: clazz.constructor as Constructor };
  }

  public static getConstructor(clazz: Function | string): Constructor {
    const constructor: Constructor = this.get(clazz, 'constructor') as Constructor;
    return constructor;
  }

  public static setBucketName(clazz: Function, value: RegistryValue): void {
    this.set(clazz, 'bucket', value);
  }

  public static getBucketName(clazz: Function | string): string {
    const bucketName: string | undefined = this.get(clazz, 'bucket') as string;
    if (!bucketName) throw new Error('No bucket name found for class.');
    return bucketName;
  }

  public static setAttributes(clazz: Function | string, attributeName: string, values: AttributeConfiguration): void {
    let configuration: AttributeConfiguration = this.get(clazz, attributeName) as AttributeConfiguration;
    if (!configuration) configuration = {};
    configuration = { ...configuration, ...values };
    this.set(clazz, attributeName, configuration);
  }

  public static getAttributes(clazz: Function | string, attributeName: string): AttributeConfiguration {
    let configuration: AttributeConfiguration = this.get(clazz, attributeName) as AttributeConfiguration;
    if (!configuration) configuration = {};
    return configuration;
  }

  public static setId(clazz: Function | string, attributeName: string, config: string | IDGenerator | UUIDV5) {
    this.set(clazz, 'id', attributeName);
    this.set(clazz, 'id-generator', config);
  }

  public static getId(clazz: Function | string): { attribute: string, strategy?: string | IDGenerator | UUIDV5 } {
    return {
      attribute: this.get(clazz, 'id') as string,
      strategy: this.get(clazz, 'id-generator') as string | IDGenerator | UUIDV5,
    }
  }

  private static set(clazz: Function | string, name: string, value: RegistryValue): void {
    if (!this.instance().ledger[clazz.constructor.name]) this.instance().ledger[clazz.constructor.name] = {};
    this.instance().ledger[clazz.constructor.name][name] = value;
  }

  private static get(clazz: Function | string, name: string): RegistryValue | undefined {
    if (typeof clazz === 'string') {
      const bucket: string | undefined = Object.keys(this.instance().ledger).find((key:string) => {
        return this.instance().ledger[key].bucket === clazz;
      });
      if (bucket) return this.instance().ledger[bucket][name];
      return undefined;
    } else {
      return this.instance().ledger[clazz.constructor.name][name];
    }
  }
}

