import { Collection } from '../Collection';

export class ObjectModified extends Error {
  constructor(key: string, collection: Collection) {
    super(`Object, ${key} in ${collection['bucket.name']}, was modified and no longer matches the starting state.`);
  }
}
