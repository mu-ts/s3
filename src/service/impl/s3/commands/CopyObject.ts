import { CopyObjectOutput, CopyObjectRequest } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { Logger, LoggerService } from '@mu-ts/logger';

import { Collection } from '../../../../model/Collection';
import { Response } from '../../../../model/Response';
import { Configuration } from '../../../Configuration';

export class CopyObject {
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
  public async do(collection: Collection, key: string, to: Collection): Promise<Response | undefined> {
    this.logger.trace('do()', { key, collection: collection['bucket.name'] });

    const parameters: CopyObjectRequest = {
      Bucket: to['bucket.name'],
      Key: `${key}`,
      CopySource: `${collection['bucket.name']}/${collection['id.prefix'] ? collection['id.prefix'] : ''}${key}`,
      StorageClass: 'STANDARD',
      ContentType: 'application/json',
      ServerSideEncryption: Configuration.get('SERVER_SIDE_ENCRYPTION') as S3.ServerSideEncryption,
    };

    this.logger.trace('do()', { parameters });

    const s3Response: CopyObjectOutput = await this.s3.copyObject(parameters).promise();

    this.logger.trace('do()', { s3Response });

    return {
      Metadata: { ...s3Response, ...s3Response.CopyObjectResult },
    } as Response;
  }
}
