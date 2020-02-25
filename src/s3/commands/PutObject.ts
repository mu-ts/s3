import { PutObjectRequest, PutObjectOutput } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { Collection } from '../../model/Collection';
import { Command } from '../Command';
import { Response } from '../Response';
import { MD5Generator } from '../../model/MD5Generator';
import { Configuration } from '../../service/Configuration';

export class PutObject extends Command {
  constructor(s3: S3) {
    super(s3);
  }

  /**
   *
   * @param key to lookup in the bucket provided
   * @param type
   */
  public async do(collection: Collection, key: string, body: string): Promise<Response | undefined> {
    this.logger.trace('do()', { key, collection: collection['bucket.name'] });

    const md5: MD5Generator = Configuration.get('MD5') as MD5Generator;
    const conentLength: number = Buffer.byteLength(body, 'utf8');
    const parameters: PutObjectRequest = {
      Bucket: collection['bucket.name'],
      Key: `${collection['id.prefix'] ? collection['id.prefix'] : ''}${key}`,
      StorageClass: 'STANDARD',
      ContentType: 'application/json',
      ContentLength: conentLength,
      ContentMD5: md5(body),
      ServerSideEncryption: Configuration.get('SERVER_SIDE_ENCRYPTION') as S3.ServerSideEncryption,
      // Metadata: this.s3Client.toAWSMetadata(metadata),
      Body: body,
    };

    this.logger.trace('do()', { parameters });

    const s3Response: PutObjectOutput = await this.s3.putObject(parameters).promise();

    this.logger.trace('do()', { s3Response });

    return {
      Body: body,
      Metadata: s3Response,
    } as Response;
  }
}
