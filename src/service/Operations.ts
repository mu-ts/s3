import { Header } from '../model/Header';

export interface Operations {
  /**
   * Returns a document for the key, within the collection mapped
   * to the type provided.
   *
   * @param key to lookup in the bucket configured for the type.
   * @param from to return an object for.
   */
  get<T>(key: string, from: T | string): Promise<T | undefined>;

  /**
   * Lists the documents in the collection attached to the type. The prefix
   *
   *
   * @param from to return an object for.
   * @param prefix to restrict results by.
   * @param continuationToken token when paginating through results.
   */
  list<T>(from: T | string, prefix: string, continuationToken?: string): Promise<Header[] | undefined>;

  /**
   * Persists an object to S3. If the object is not decorated with @collection
   * or any other hints indicating where/how the object should be stored, then
   * its configuration will be looked up via `constructor.name`. If nothing
   * can be found an error is thrown.
   *
   * @param object to put.
   * @param to put the object too, if object does not have type information on it.
   */
  put<T>(object: T, to?: T | string): Promise<T | undefined>;

  /**
   * Removes the document, or marks the current version for delete
   * in S3, within the collection mapped to the type provided.
   *
   * @param key to lookup in the bucket configured for the type.
   * @param from to return an object for.
   */
  remove<T>(key: string, from: T | string): Promise<T | undefined>;

  /**
   * Returns a document for the key, within the collection mapped
   * to the type provided.
   *
   * @param key to lookup in the bucket configured for the type.
   * @param from to return an object for.
   */
  head<T>(key: string, from: T | string): Promise<Header | undefined>;

  /**
   * Queries a document and returns a subset of its information, serialized and cast into the type
   * provided.
   *
   * @param sql to query the document with.
   * @param key to lookup in the bucket configured for the type.
   * @param from to lookup the bucket to locate teh document in.
   * @param as (optional) to parse the data and cast it to.
   */
  select<T, F>(sql: string, key: string, from: F | string, as?: T): Promise<T | undefined>;
}
