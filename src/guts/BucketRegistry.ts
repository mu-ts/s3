import { AttributeConfiguration } from '../model/AttributeConfiguration';
import { IDGenerator } from '../model/IDGenerator';
import { UUIDV5 } from '../model/UUIDV5';

type RegistryValue = string | IDGenerator | UUIDV5 | AttributeConfiguration;

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
    this.instance().ledger[clazz.constructor.name] = { bucket };
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

  public static set(clazz: Function | string, name: string, value: RegistryValue): void {
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