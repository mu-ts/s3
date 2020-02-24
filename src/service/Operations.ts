export interface Operations {
  /**
   * Returns a document for the key, within the collection mapped
   * to the type provided.
   *
   * @param key to lookup in the bucket configured for the type.
   * @param type to return an object for.
   */
  get<T>(key: string, type: T | string): Promise<T | undefined>;

  /**
   * Lists the documents in the collection attached to the type. The prefix
   * 
   *
   * @param type to return an object for.
   */
  list<T>(type: T | string, continuationToken?:string): Promise<? | undefined>;
  list<T>(prefix: string, type: T | string, continuationToken?:string): Promise<? | undefined>;

  /**
   * Persists an object to S3. If the object is not decorated with @collection
   * or any other hints indicating where/how the object should be stored, then
   * its configuration will be looked up via `constructor.name`. If nothing
   * can be found an error is thrown.
   *
   * @param object to put.
   * @param collide (false) if true, will not put the document if another already exists.
   */
  put<T>(object: T, collide?: boolean): Promise<T | undefined>;

  /**
   * Removes the document, or marks the current version for delete
   * in S3, within the collection mapped to the type provided.
   *
   * @param key to lookup in the bucket configured for the type.
   * @param type to return an object for.
   */
  remove<T>(key: string, type: T | string): Promise<T | undefined>;
}
