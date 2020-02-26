import S3 = require('aws-sdk/clients/s3');
import { AWSError } from 'aws-sdk';
import { v4 } from 'uuid';

import { Logger, LoggerService } from '@mu-ts/logger';

import { Operations } from '../Operations';
import { Header } from '../../model/Header';
import { Collection } from '../../model/Collection';
import { CollectionRegistry } from '../CollectionRegistry';
import { GetObject } from './s3/commands/GetObject';
import { Response } from '../../model/Response';
import { NotFound } from '../../model/error/NotFound';
import { DocumentDecorator } from '../DocumentDecorator';
import { Misconfiguration } from '../../model/error/Misconfiguration';
import { ObjectModified } from '../../model/error/ObjectModified';
import { TimedOut } from '../../model/error/TimedOut';
import { ListObjects } from './s3/commands/ListObjects';
import { PutObject } from './s3/commands/PutObject';
import { IDGenerator } from '../../model/functions/IDGenerator';
import { Configuration } from '../Configuration';
import { Document } from '../../model/Document';
import { MD5Generator } from '../../model/functions/MD5Generator';
import { NoTypeOnObject } from '../../model/error/NoTypeOnObject';
import { SerializerServices } from '../SerializerService';
import { HeadObject } from './s3/commands/HeadObject';
import { CopyObject } from './s3/commands/CopyObject';
import { RemoveObject } from './s3/commands/RemoveObject';
import { Diacritics } from './Diacritics';

export class S3Operations extends Operations {
  private readonly logger: Logger;

  private readonly documentDecorator: DocumentDecorator;
  private readonly collectionRegistry: CollectionRegistry;

  private readonly serializerService: SerializerServices;
  private readonly diacritics: Diacritics;

  private readonly copyObject: CopyObject;
  private readonly getObject: GetObject;
  private readonly headObject: HeadObject;
  private readonly listObjects: ListObjects;
  private readonly putObject: PutObject;
  private readonly removeObject: RemoveObject;

  constructor(
    s3: S3,
    serializerService: SerializerServices,
    collectionRegistry: CollectionRegistry,
    documentDecorator: DocumentDecorator,
    diacritics: Diacritics
  ) {
    super();
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });

    this.serializerService = serializerService;
    this.diacritics = diacritics;

    this.documentDecorator = documentDecorator;
    this.collectionRegistry = collectionRegistry;

    this.copyObject = new CopyObject(s3);
    this.getObject = new GetObject(s3);
    this.headObject = new HeadObject(s3);
    this.listObjects = new ListObjects(s3);
    this.putObject = new PutObject(s3);
    this.removeObject = new RemoveObject(s3);

    this.logger.debug('init()');
  }

  /**
   * Returns a document from S3.
   *
   * @param key to lookup in S3.
   * @param from location to resolve S3 bucket from.
   */
  public async get<T>(from: T | string, key: string): Promise<T | undefined> {
    const collection: Collection | undefined = this.collectionRegistry.recall(from);
    if (!collection) throw new NoTypeOnObject();

    try {
      const response: Response = await this.getObject.do(collection, key);

      if (!response.Body) return undefined;

      const object: any = this.serializerService.deserialize(response.Body, collection);

      this.documentDecorator.decorate(object, response.Metadata);

      //TODO lookup tags and update object with tags.

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
            Key: item.Key,
            ETag: item.ETag,
            Size: item.Size,
            LastModified: item.LastModified,
          } as Header)
      );

      this.documentDecorator.decorate(rows, response.Metadata);

      return rows;
    } catch (error) {
      return this.handleError(error, collection);
    }
  }

  /**
   * @param type of object.
   * @param object to put.
   */
  public async put<T>(to: T | string, object: T): Promise<T | undefined> {
    const collection: Collection | undefined = this.collectionRegistry.recall(to || object.constructor.name);
    if (!collection) throw new NoTypeOnObject();

    try {
      const document: Document = this.documentDecorator.get(object);
      const metadata: S3.Metadata = collection['fields.metadata']
        ? collection['fields.metadata'].reduce((metadata: S3.Metadata, field: string) => {
            if ((object as any)[field]) metadata[field] = this.diacritics.remove(String((object as any)[field]));
            return metadata;
          }, {})
        : undefined;
      const serializedBody: string = this.serializerService.serialize(object, collection, document);
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

      const response: Response = await this.putObject.do(collection, id, serializedBody, metadata);

      if (!response.Body) return undefined;

      const returnObject: any = this.serializerService.deserialize(response.Body, collection);

      this.documentDecorator.decorate(returnObject, response.Metadata);

      return returnObject;
    } catch (error) {
      return this.handleError(error, collection);
    }
  }

  /**
   *
   * @param from
   * @param key
   * @param to
   */
  public async copy<F, T>(from: F | string, key: string, to: T): Promise<T | undefined> {
    const collection: Collection | undefined = this.collectionRegistry.recall(from);
    if (!collection) throw new NoTypeOnObject();

    const toCollection: Collection | undefined = this.collectionRegistry.recall(to);

    try {
      const response: Response = await this.copyObject.do(collection, key, toCollection);

      if (!response.Body) return undefined;

      const object: any = this.serializerService.deserialize(response.Body, toCollection);

      this.documentDecorator.decorate(object, response.Metadata);

      // TODO The type needs to be converted so the type isnt mappted to the same type.

      return object as T;
    } catch (error) {
      return this.handleError(error, collection, key);
    }
  }

  /**
   *
   * @param from
   * @param key
   */
  public async remove<T>(from: T | string, key: string): Promise<undefined> {
    const collection: Collection | undefined = this.collectionRegistry.recall(from);
    if (!collection) throw new NoTypeOnObject();

    try {
      const response: Response = await this.removeObject.do(collection, key);

      /**
       * Response does have metadata that might be useful when object versions are better
       * supported.
       */
      if (!response.Body) return undefined;

      return undefined;
    } catch (error) {
      return this.handleError(error, collection, key);
    }
  }

  /**
   *
   * @param from
   * @param key
   */
  public async head<T>(from: T | string, key: string): Promise<Header | undefined> {
    const collection: Collection | undefined = this.collectionRegistry.recall(from);
    if (!collection) throw new NoTypeOnObject();

    try {
      const response: Response = await this.headObject.do(collection, key);

      if (!response.Body) return undefined;

      const object: any = this.serializerService.deserialize(response.Body, collection);

      this.documentDecorator.decorate(object, response.Metadata);

      //TODO lookup tags and update object with tags.

      return object;
    } catch (error) {
      return this.handleError(error, collection, key);
    }
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
          if (this.isSafe) throw new NotFound(key, collection);
          else return undefined;

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
