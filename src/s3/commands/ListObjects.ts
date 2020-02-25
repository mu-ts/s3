import { ListObjectsV2Request, ListObjectsV2Output } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { Collection } from '../../model/Collection';
import { Command } from '../Command';
import { Response } from '../Response';
import { Configuration } from '../../service/Configuration';

export class ListObjects extends Command {
  constructor(s3: S3) {
    super(s3);
  }

  /**
   *
   * @param key to lookup in the bucket provided
   * @param type
   */
  public async do(collection: Collection, prefix?: string, continuationToken?: string): Promise<Response | undefined> {
    this.logger.trace('do()', { prefix, continuationToken, collection: collection['bucket.name'] });

    const parameters: ListObjectsV2Request = {
      Bucket: collection['bucket.name'],
      Prefix: `${collection['id.prefix'] ? collection['id.prefix'] : ''}${prefix}`,
      MaxKeys: Configuration.get('PAGE_SIZE') as number,
      FetchOwner: false,
      ContinuationToken: continuationToken,
    };

    this.logger.trace('do()', { parameters });

    const s3Response: ListObjectsV2Output = await this.s3.listObjectsV2(parameters).promise();

    this.logger.trace('do()', { s3Response });

    return {
      ContinuationToken: s3Response.NextContinuationToken,
      Rows: s3Response.Contents,
      Metadata: s3Response,
    } as Response;
  }
}
