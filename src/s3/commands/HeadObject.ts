import { HeadObjectRequest, HeadObjectOutput } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { Collection } from '../../model/Collection';
import { Command } from '../Command';
import { Response } from '../Response';

export class HeadObject extends Command {
  constructor(s3: S3) {
    super(s3);
  }

  /**
   *
   * @param key to lookup in the bucket provided
   * @param type
   */
  public async do(collection: Collection, key: string): Promise<Response | undefined> {
    this.logger.trace('do()', { key, collection: collection['bucket.name'] });

    const parameters: HeadObjectRequest = {
      Bucket: collection['bucket.name'],
      Key: `${collection['id.prefix'] ? collection['id.prefix'] : ''}${key}`,
    };

    this.logger.trace('do()', { parameters });

    const s3Response: HeadObjectOutput = await this.s3.headObject(parameters).promise();

    this.logger.trace('do()', { s3Response });

    return {
      Metadata: s3Response,
    } as Response;
  }
}
