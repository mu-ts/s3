import { Collection } from '../Collection';

export class NotFound extends Error {
  constructor(key: string, collection: Collection) {
    super(`Could not find ${key} in ${collection['bucket.name']}.`);
  }
}
