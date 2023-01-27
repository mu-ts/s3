import { BucketRegistry } from "./BucketRegistry";
import { Diacritics } from "./Diacritics";

export class Tagged {
  private constructor() { }

  public static tags(object: any, clazz: Function): Record<string, string> {
    return Object.keys(object)
      .filter((key: string) => BucketRegistry.getAttributes(clazz, key).tag)
      .filter((key: string) => typeof object[key] === 'string')
      .map((key: string) => ({ [key]: Diacritics.remove(object[key] as string) }))
      .reduce((tags: Record<string, string>, pair: Record<string, string>) => ({ ...tags, ...pair }), {})
  }
}