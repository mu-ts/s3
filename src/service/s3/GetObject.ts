import { GetObjectOutput, GetObjectRequest } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { Collection } from '../Collection';
import { Command } from '../../model/s3/Command';
import { Response } from '../../model/s3/Response';

export class GetObject extends Command {
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

    const parameters: GetObjectRequest = {
      Bucket: collection['bucket.name'],
      Key: `${collection['id.prefix'] ? collection['id.prefix'] : ''}${key}`,
    };

    this.logger.trace('do()', { parameters });

    const s3Response: GetObjectOutput = await this.s3.getObject(parameters).promise();

    this.logger.trace('do()', { s3Response });

    return {
      Body: s3Response.Body,
      Metadata: s3Response,
    } as Response;
  }
}
