import { CopyObjectOutput, CopyObjectRequest } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { Collection } from '../../model/Collection';
import { Command } from '../Command';
import { Response } from '../Response';
import { Configuration } from '../../service/Configuration';
import { Diacritics } from '../../service/Diacritics';

export class CopyObject extends Command {
  constructor(s3: S3) {
    super(s3);
  }

  /**
   *
   * @param key to lookup in the bucket provided
   * @param type
   */
  public async do(collection: Collection, key: string, to: string, metadata?: { [key: string]: string }): Promise<Response | undefined> {
    this.logger.trace('do()', { key, collection: collection['bucket.name'] });

    const parameters: CopyObjectRequest = {
      Bucket: to,
      Key: `${key}`,
      CopySource: `${collection['bucket.name']}/${collection['id.prefix'] ? collection['id.prefix'] : ''}${key}`,
      StorageClass: 'STANDARD',
      ContentType: 'application/json',
      ServerSideEncryption: Configuration.get('SERVER_SIDE_ENCRYPTION') as S3.ServerSideEncryption,
      Metadata: metadata
        ? Object.keys(metadata)
            .filter((key: string) => metadata[key] !== undefined)
            .reduce((newMetadata: { [key: string]: string }, key: string) => {
              newMetadata[key] = Diacritics.remove('' + metadata[key]);
              return newMetadata;
            }, {})
        : undefined,
    };

    this.logger.trace('do()', { parameters });

    const s3Response: CopyObjectOutput = await this.s3.copyObject(parameters).promise();

    this.logger.trace('do()', { s3Response });

    return {
      Metadata: { ...s3Response, ...s3Response.CopyObjectResult },
    } as Response;
  }
}
