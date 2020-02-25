import S3 = require('aws-sdk/clients/s3');

import { Logger, LoggerService } from '@mu-ts/logger';

import { Operations } from '../../model/Operations';
import { Header } from '../../model/Header';
import { Collection } from '../../model/Collection';
import { CollectionRegistry } from '../CollectionRegistry';
import { GetObject } from './GetObject';
import { Response } from '../../model/s3/Response';
import { Deserializer } from '../../model/Deserialize';
import { Serializer } from '../../model/Serialize';
import { NotFound } from '../../model/error/NotFound';
import { DocumentDecorator } from '../DocumentDecorator';

export class S3Operations implements Operations {
  private readonly logger: Logger;

  private readonly documentDecorator: DocumentDecorator;
  private readonly collectionRegistry: CollectionRegistry;

  private readonly deserializer: Deserializer;
  private readonly serializer: Serializer;

  private readonly getObject: GetObject;

  constructor(s3: S3, deserializer: Deserializer, serializer: Serializer, collectionRegistry: CollectionRegistry, documentDecorator: DocumentDecorator) {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });

    this.serializer = serializer;
    this.deserializer = deserializer;

    this.documentDecorator = documentDecorator;
    this.collectionRegistry = collectionRegistry;

    this.getObject = new GetObject(s3);

    this.logger.debug('init()');
  }

  /**
   * Returns a document from S3.
   *
   * @param key to lookup in S3.
   * @param from location to resolve S3 bucket from.
   */
  public async get<T>(key: string, from: T | string): Promise<T | undefined> {
    const collection: Collection = this.collectionRegistry.recall(from);

    try {
      const response: Response = await this.getObject.do(collection, key);

      if (!response.Body) return undefined;

      const object: any = this.deserializer(response.Body, collection);
      /**
       * decorate object with metadata from S3.
       */
      this.documentDecorator.decorate(object, response.Metadata);

      return object;
    } catch (error) {
      if ('NoSuchKey' === error.code) throw new NotFound(key, collection);
      throw error;
    }
  }

  // list<T>(from: T | string, continuationToken?: string): Promise<Header[] | undefined> {
  public async list<T>(from: T | string, prefix?: T | string, continuationToken?: string): Promise<Header[] | undefined> {
    return Promise.resolve(undefined);
  }

  public async put<T>(object: T, collide?: boolean): Promise<T | undefined> {
    return Promise.resolve(undefined);
  }

  public async remove<T>(key: string, from: T | string): Promise<T | undefined> {
    return Promise.resolve(undefined);
  }

  public async head<T>(key: string, from: T | string): Promise<Header | undefined> {
    return Promise.resolve(undefined);
  }

  public async select<T, F>(sql: string, key: string, from: F | string, as?: T): Promise<T | undefined> {
    return Promise.resolve(undefined);
  }
}
