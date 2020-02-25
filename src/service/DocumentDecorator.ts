import { Document } from '../model/Document';

export class DocumentDecorator {
  private readonly PROPERTY_KEY = '__mu-ts-s3-metadata';

  private constructor() {}

  /**
   *
   * @param target
   * @param document
   */
  public decorate(target: any, source: any): Document {
    const document: Document = {};

    for (const name in this) {
      const key: keyof Document = name as keyof Document;
      if (source[key]) (document[key] as any) = source[key];
    }

    Object.defineProperty(target, this.PROPERTY_KEY, { value: Object.freeze(document), writable: false });

    return Object.freeze(document);
  }

  /**
   *
   * @param target
   */
  public get(target: any): Document {
    return target[this.PROPERTY_KEY] as Document;
  }
}
