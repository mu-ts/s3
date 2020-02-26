import { Header } from '../model/Header';

export abstract class Operations {
  protected isSafe: boolean = false;

  public get safe(): Operations {
    this.isSafe = true;
    return this;
  }

  /**
   * Returns a document for the key, within the collection mapped
   * to the type provided.
   *
   * @param from to return an object for.
   * @param key to lookup in the bucket configured for the type.
   */
  abstract get<T>(from: T | string, key: string): Promise<T | undefined>;

  /**
   * Lists the documents in the collection attached to the type. The prefix
   *
   *
   * @param from to return an object for.
   * @param prefix to restrict results by.
   * @param continuationToken token when paginating through results.
   */
  abstract list<T>(from: T | string, prefix: string, continuationToken?: string): Promise<Header[] | undefined>;

  /**
   * Persists an object to S3. If the object is not decorated with @collection
   * or any other hints indicating where/how the object should be stored, then
   * its configuration will be looked up via `constructor.name`. If nothing
   * can be found an error is thrown.
   *
   * @param to put the object too, if object does not have type information on it.
   * @param object to put.
   */
  abstract put<T>(to: T | string, object: T): Promise<T | undefined>;

  /**
   * Duplicates the record identified by the key, in teh collection defined
   * by the type and moves it 'to' the bucket or type defined.
   *
   * @param from type or bucket to locate the object.
   * @param key used to find the object.
   * @param to type to copy this object over to.
   */
  abstract copy<F, T>(from: F | string, key: string, to: T): Promise<T | undefined>;

  /**
   * Removes the document, or marks the current version for delete
   * in S3, within the collection mapped to the type provided.
   *
   * @param from to return an object for.
   * @param key to lookup in the bucket configured for the type.
   */
  abstract remove<T>(from: T | string, key: string): Promise<undefined>;

  /**
   * Returns a document for the key, within the collection mapped
   * to the type provided.
   *
   * @param from to return an object for.
   * @param key to lookup in the bucket configured for the type.
   */
  abstract head<T>(from: T | string, key: string): Promise<Header | undefined>;

  /**
   * Queries a document and returns a subset of its information, serialized and cast into the type
   * provided.
   *
   * @param from to lookup the bucket to locate teh document in.
   * @param key to lookup in the bucket configured for the type.
   * @param sql to query the document with.
   * @param as (optional) to parse the data and cast it to.
   */
  // select<T, F>(from: F | string, key: string, sql: string, as?: T): Promise<T | undefined>;
}
