import S3 = require('aws-sdk/clients/s3');

import { Logger, LoggerService } from '@mu-ts/logger';

import { Collection } from '../../service/Collection';
import { Response } from './Response';

/**
 * Interface to be implemented to specify the generator pattern for
 * a collection.
 */
export abstract class Command {
  protected readonly logger: Logger;
  protected readonly s3: S3;

  constructor(s3: S3) {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 's3' } });
    this.s3 = s3;
    this.logger.debug('init()');
  }

  /**
   *
   * @param args provided to execute.
   */
  public abstract async do(collection: Collection, ...args: any[]): Promise<Response | undefined>;
}
