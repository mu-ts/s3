import { /* AWSError, */ S3, config } from 'aws-sdk';

import { LoggerService, Logger } from '@mu-ts/logger';
import { Configuration } from './Configuration';

export class S3Facade {
  private static _i: S3Facade;

  private readonly logger: Logger;
  private _s3: S3;

  private constructor() {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });

    config.update({
      region: Configuration.get('REGION') as string,
      s3: {
        // TODO map to mu-ts logger if it makes sense to in the future. For trace logging.
        // logger: {
        //   write?: (chunk: any, encoding?: string, callback?: () => void) => void
        //   log?: (...messages: any[]) => void;
        // }
        httpOptions: {
          timeout: Configuration.get('TIMEOUT') as number,
          connectTimeout: Configuration.get('CONNECT_TIMEOUT') as number,
        },
        sslEnabled: true,
      },
    });

    this.logger.info('init()');
  }

  /**
   * Returns the shared S3 instance.
   */
  public static get s3() {
    if (!this.instance._s3) this.instance._s3 = new S3({ apiVersion: '2006-03-01' });
    return this.instance._s3;
  }

  /**
   * Gets an instance of the S3Facade.
   */
  private static get instance() {
    if (!this._i) this._i = new S3Facade();
    return this._i;
  }
}
