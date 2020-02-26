import { DeleteObjectRequest, DeleteObjectOutput } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { Logger, LoggerService } from '@mu-ts/logger';

import { Collection } from '../../../../model/Collection';
import { Response } from '../../../../model/Response';

export class RemoveObject {
  protected readonly logger: Logger;
  protected readonly s3: S3;

  constructor(s3: S3) {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    this.s3 = s3;
    this.logger.debug('init()');
  }

  /**
   *
   * @param key to lookup in the bucket provided
   * @param type
   */
  public async do(collection: Collection, key: string): Promise<Response | undefined> {
    this.logger.trace('do()', { key, collection: collection['bucket.name'] });

    const parameters: DeleteObjectRequest = {
      Bucket: collection['bucket.name'],
      Key: `${collection['id.prefix'] ? collection['id.prefix'] : ''}${key}`,
    };

    this.logger.trace('do()', { parameters });

    const s3Response: DeleteObjectOutput = await this.s3.deleteObject(parameters).promise();

    this.logger.trace('do()', { s3Response });

    return {
      Metadata: s3Response,
    } as Response;
  }
}
