import { Configuration } from '../service/Configuration';
import { CollectionRegistry } from '../service/CollectionRegistry';

/**
 * @collection('name') will map a specific entity to a bucket (for the appropriate
 * naming convention.)
 *
 * @param configuration for the collection.
 */
export function collection(): any {
  return (target: typeof Function): typeof Function | void => {
    let name: string = String(Configuration.get('BUCKET_NAME_PATTERN'));

    const parts: string[] = name.split(/[\.-]/g);
    parts.forEach(
      (part: string) => (name = name.replace(part, part === 'type' ? target.name.toLowerCase() : (Configuration.get(part as keyof Configuration) as string)))
    );

    CollectionRegistry.register(target, { 'bucket.name': name });

    return target;
  };
}
