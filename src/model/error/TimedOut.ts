import { Collection } from '../Collection';

export class TimedOut extends Error {
  constructor(key: string, collection: Collection) {
    super(`Operation timed out. While accessing ${key} in ${collection['bucket.name']}`);
  }
}
