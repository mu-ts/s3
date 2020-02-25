import S3 = require('aws-sdk/clients/s3');

import { Logger, LoggerService } from '@mu-ts/logger';

import { Operations } from '../model/Operations';
import { Header } from '../model/Header';
import { Collection } from '../model/Collection';
import { CollectionRegistry } from '../service/CollectionRegistry';
import { GetObject } from './commands/GetObject';
import { Response } from './Response';
import { Deserializer } from '../model/Deserialize';
import { Serializer } from '../model/Serialize';
import { NotFound } from '../model/error/NotFound';
import { DocumentDecorator } from '../service/DocumentDecorator';
import { AWSError } from 'aws-sdk';
import { Misconfiguration } from '../model/error/Misconfiguration';
import { ObjectModified } from '../model/error/ObjectModified';
import { TimedOut } from '../model/error/TimedOut';

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
      this.documentDecorator.decorate(object, response.Metadata);

      return object;
    } catch (error) {
      return this.handleError(error, collection, key);
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

  /**
   *
   * @param error to process
   * @param collection in use when error was encountered.
   * @param key being interacted with.
   */
  public handleError(error: Error | AWSError, collection: Collection, key?: string): undefined {
    if ((error as AWSError).code) {
      const awsError: AWSError = error as AWSError;
      /* https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html */
      switch (awsError.code) {
        case 'PreconditionFailed':
          throw new ObjectModified(key, collection);

        case 'NoSuchKey':
          throw new NotFound(key, collection);

        case 'RequestTimeout':
          throw new TimedOut(key, collection);

        case 'NoSuchBucket':
          throw new Misconfiguration(`${collection['bucket.name']} is not a valid bucket or is not visible/accssible.`);

        case 'Forbidden':
          throw new Misconfiguration(
            `The user or role does not have permission to access the bucket (${collection['bucket.name']}) or key (${key}) within the bucket.`
          );

        default:
          throw error;
      }
    }
    throw error;
  }
}
