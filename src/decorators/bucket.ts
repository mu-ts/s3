import { BucketRegistry } from '../guts/BucketRegistry';

/**
 * Used to mark a class to store its instances in a specific bucket.
 * 
 * @param name of the bucket for a class to persist its objects within.
 * @returns 
 */
export function bucket(name: string): any {
  return (target: typeof Function): typeof Function | void => {
    BucketRegistry.register(target, name);
    return target;
  };
}
  