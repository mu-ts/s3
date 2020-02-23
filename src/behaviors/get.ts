import { Logger, LoggerService } from '@mu-ts/logger';
// import { GetObjectOutput, GetObjectRequest } from 'aws-sdk/clients/s3';
// import S3 = require('aws-sdk/clients/s3');
import { Registry } from '../service/Registry';
import { Metadata } from '../model/Metadata';
import { collection } from '../decorator/collection';

class Get {
  // private static _i: Get;
  private readonly logger: Logger;
  // private readonly s3?: S3;

  constructor(/*s3?: S3*/) {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    // this.s3 = s3;
    this.logger.info('init()');
  }

  /**
   *
   * @param key to lookup in the bucket provided
   * @param type
   */
  public async do<T>(key: string, type: T | string): Promise<T | undefined> {
    // this.logger.debug('getObject()', 'Looking up object in bucket.', { key, type });
    console.log('Type', { key, type, typeof: typeof type });

    const metadata: Metadata = Registry.metadata(type);

    console.log('metadata', { metadata });

    // const parameters: GetObjectRequest = {
    //   Bucket: th,
    //   Key: key
    // };

    // this.logger.debug({ parameters }, 'load()', `for ${id} -->`);

    // const response: GetObjectOutput = await this.s3.getObject(parameters).promise();

    // this.logger.debug({ response }, 'load()', `response from s3 for ${id} -->`);

    // const s3Object: S3Object = new S3Object(response.Body.toString('utf8'), this.s3Client.buildS3Metadata(response));

    return Promise.resolve(undefined);
  }

  // /**
  //  * S3 is a singleton, this makes accessing it much easier/neater.
  //  */
  // private static get instance() {
  //   if (!this._i) this._i = new Get();
  //   return this._i;
  // }
}

process.env.LOG_LEVEL = 'trace';

@collection()
class User {}

const go = async () => {
  const user: User = await new Get().do('test', User);
  console.log(user);
};

go();
