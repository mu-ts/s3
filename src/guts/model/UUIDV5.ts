/**
 * Uses the V5 UUID id generation strategy to create a new UUID.
 *
 * @param seedAttribute is the attribute on the object to get the seed for the UUID v5.
 * @param namespace value to use (static value not attribute), if not provided then the bucket name is used.
 */
export class UUIDV5 {
  constructor(private namespace?: string) {
  }

  public getNamespace(): string | undefined {
    return this.namespace;
  }
}