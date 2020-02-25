import S3 = require('aws-sdk/clients/s3');
import { AWSError } from 'aws-sdk';
import { v4 } from 'uuid';

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
import { Misconfiguration } from '../model/error/Misconfiguration';
import { ObjectModified } from '../model/error/ObjectModified';
import { TimedOut } from '../model/error/TimedOut';
import { ListObjects } from './commands/ListObjects';
import { PutObject } from './commands/PutObject';
import { IDGenerator } from '../model/IDGenerator';
import { Configuration } from '../service/Configuration';
import { Document } from '../model/Document';
import { MD5Generator } from '../model/MD5Generator';
import { NoTypeOnObject } from '../model/error/NoTypeOnObject';

export class S3Operations implements Operations {
  private readonly logger: Logger;

  private readonly documentDecorator: DocumentDecorator;
  private readonly collectionRegistry: CollectionRegistry;

  private readonly deserializer: Deserializer;
  private readonly serializer: Serializer;

  private readonly getObject: GetObject;
  private readonly listObjects: ListObjects;
  private readonly putObject: PutObject;

  constructor(s3: S3, deserializer: Deserializer, serializer: Serializer, collectionRegistry: CollectionRegistry, documentDecorator: DocumentDecorator) {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });

    this.serializer = serializer;
    this.deserializer = deserializer;

    this.documentDecorator = documentDecorator;
    this.collectionRegistry = collectionRegistry;

    this.getObject = new GetObject(s3);
    this.listObjects = new ListObjects(s3);
    this.putObject = new PutObject(s3);

    this.logger.debug('init()');
  }

  /**
   * Returns a document from S3.
   *
   * @param key to lookup in S3.
   * @param from location to resolve S3 bucket from.
   */
  public async get<T>(key: string, from: T | string): Promise<T | undefined> {
    const collection: Collection | undefined = this.collectionRegistry.recall(from);

    if (!collection) throw new NoTypeOnObject();

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

  /**
   *
   * @param from to look for objects in.
   * @param prefix to look for objects with.
   * @param continuationToken to paginate through items with.
   */
  public async list<T>(from: T | string, prefix?: string, continuationToken?: string): Promise<Header[] | undefined> {
    const collection: Collection | undefined = this.collectionRegistry.recall(from);

    if (!collection) throw new NoTypeOnObject();

    try {
      const response: Response = await this.listObjects.do(collection, prefix, continuationToken);

      if (!response.Body) return undefined;

      const rows: Header[] = response.Rows.map(
        (item: S3.Object) =>
          ({
            key: item.Key,
            eTag: item.ETag,
            size: item.Size,
            lastModified: item.LastModified,
          } as Header)
      );

      this.documentDecorator.decorate(rows, response.Metadata);

      return rows;
    } catch (error) {
      return this.handleError(error, collection);
    }
  }

  /**
   *
   * @param object to put.
   */
  public async put<T>(object: T, to?: T | string): Promise<T | undefined> {
    const collection: Collection | undefined = this.collectionRegistry.recall(to || object.constructor.name);

    if (!collection) throw new NoTypeOnObject();

    try {
      const document: Document = this.documentDecorator.get(object);
      const serializedBody: string = this.serializer(object, collection, document);
      const md5Generator: MD5Generator = Configuration.get('MD5') as MD5Generator;
      const md5: string = md5Generator(serializedBody);

      /**
       * No reason to do anything else, the object is not modified.
       */
      if (document['body.md5'] === md5) return object;

      /**
       * Get the ID, or create it.
       */
      const idName: string = collection['id.name'];
      const id: string = (object as any)[idName] || (collection['id.generator'] as IDGenerator)(object, v4());

      const response: Response = await this.putObject.do(collection, id, serializedBody);

      if (!response.Body) return undefined;

      const returnObject: any = this.deserializer(response.Body, collection);

      this.documentDecorator.decorate(returnObject, response.Metadata);

      return returnObject;
    } catch (error) {
      return this.handleError(error, collection);
    }
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
