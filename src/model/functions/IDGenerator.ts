/**
 * Interface to be implemented to specify the generator pattern for
 * a collection.
 */
export type IDGenerator = <T>(document: T, uuid: string) => string;
