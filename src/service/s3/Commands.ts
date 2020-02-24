import { GetObjectOutput, GetObjectRequest } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { Logger, LoggerService } from '@mu-ts/logger';

import { Collection } from '../Collection';
import { Deserializer } from '../../model/Deserialize';
import { Document } from '../Document';

export class Commands {
  private readonly logger: Logger;
  // private readonly s3: S3;
  // private readonly deserializer: Deserializer;
  // private isSafe: boolean = false;

  constructor(s3: S3, deserializer: Deserializer) {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    // this.s3 = s3;
    // this.deserializer = deserializer;
    this.logger.debug('init()');
  }

  // /**
  //  * Throws errors more aggressively.
  //  */
  // public get safe() {
  //   this.isSafe = true;
  //   return this;
  // }

  /**
   *
   * @param key to lookup in the bucket provided
   * @param type
   */
  public async do<T>(key: string, type: T): Promise<T | undefined> {
    this.logger.debug('getObject()', { key, type });

    const metadata: Collection | undefined = Collection.get(type);

    this.logger.trace('getObject()', { metadata });

    const parameters: GetObjectRequest = {
      Bucket: metadata['bucket.name'],
      Key: key,
    };

    this.logger.trace('getObject()', { parameters });

    try {
      const response: GetObjectOutput = await this.s3.getObject(parameters).promise();

      this.logger.trace('getObject()', { response });

      const object: T = this.deserializer(response.Body.toString('utf8')) as T;

      this.logger.trace('getObject()', { object }, 'serialized from Body.');

      Document.set(object, response);

      this.logger.debug('getObject()', 'metadata attached to object.');

      return object;
    } catch (error) {
      if (!error.code) throw error;
      if ('NoSuchKey' === error.code && this.isSafe) return undefined;
      throw error;
    }
  }
}
