import { Collection } from '../model/Collection';

export abstract class CollectionRegistry {
  /**
   *
   * @param type of data to register for.
   * @param options to apply to the stored data.
   */
  public abstract recall<T>(type: T | string): Collection | undefined;

  /**
   *
   * @param type of the type to get data for.
   */
  public abstract register<T>(type: string | T, options: { [T in keyof Collection]: Collection[T] }): void;
}
