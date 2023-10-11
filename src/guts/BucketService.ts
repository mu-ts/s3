import { v4, v5 } from "uuid";
import { IDGenerator, UUIDV5, bucket } from "../objects";

export class BucketService {
  public static getName(bucketOrObject: string | any) {
    if (typeof bucketOrObject === 'string') return bucketOrObject;
    return bucketOrObject['mu-ts']?.bucket || bucketOrObject.constructor?.['mu-ts']?.bucket
  }

  public static setKey(object: any): string {

    const metadata: Record<string, any> | undefined = object['mu-ts'] || object.constructor['mu-ts']

    /**
     * Gues what field might be the key.
     */
    if (!metadata) return object['key'] || object['id'] || object['_id'] || object['Key'];
    
    const { field, generator }: { field: string, generator?: IDGenerator | 'uuid' | UUIDV5 } | undefined =  metadata?.id;

    /**
     * Otherwise drop into the logic where the ID is generated.
     */
    if (generator === 'uuid') object[field] =  v4();
    else if (typeof generator === 'function') object[field] =  generator(object);
    /**
     * UUID5 gives a deterministic UUID based on the namespace provdied.
     */
    else if (generator instanceof UUIDV5) {
      /**
       * First argument is the seed, second argument is the namespace.
       */
      object[field] = v5(object[field], generator.getNamespace());
    }

    /**
     * If no algorithm was set then we should return the field by default.
     */
    return object[field];
  }
}