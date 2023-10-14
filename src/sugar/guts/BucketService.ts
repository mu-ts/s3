export class BucketService {

  public static PREFIX: string = 'mu-ts/s3'

  public static getName(bucketOrObject: string | any) {
    if (typeof bucketOrObject === 'string') return bucketOrObject;
    return bucketOrObject[this.PREFIX]?.bucket || bucketOrObject.constructor?.[this.PREFIX]?.bucket
  }

  public static setMetadata(instance: any, metadata: Record<string, string>) {
    if (instance.constructor[this.PREFIX]) instance.constructor[this.PREFIX].metadata = metadata;
  }

  public static getMetadata(instance: any): Record<string, string> {
    return instance.constructor?.[this.PREFIX].metadata;
  }

  public static getId(_body: string, instance: any): string | undefined {
    /**
     * Locate the possible keys when re-hydrating, we don't care about other attributes.
     */
    const idFieldName: string | undefined = instance.constructor[this.PREFIX]?.id;
    const idFieldAndValue = JSON.parse(_body, (key: string, value: any) => {
      console.log('parse()', { key })
      if (key === '') return value;
      else if (idFieldName && key === idFieldName) return value;
      else if (!idFieldName && ['id', '_id', 'ID', 'Id', 'Key', 'key'].includes(key)) return value;
      else return undefined;
    })

    return Object.values(idFieldAndValue).pop() as string;

  }

  // public static setKey(object: any): string {


  //   /**
  //    * Gues what field might be the key.
  //    */
  //   if (!metadata) return object['key'] || object['id'] || object['_id'] || object['Key'];
    
  //   const { field, generator }: { field: string, generator?: IDGenerator | 'uuid' | UUIDV5 } | undefined =  metadata?.id;

  //   /**
  //    * Otherwise drop into the logic where the ID is generated.
  //    */
  //   if (generator === 'uuid') object[field] =  v4();
  //   else if (typeof generator === 'function') object[field] =  generator(object);
  //   /**
  //    * UUID5 gives a deterministic UUID based on the namespace provdied.
  //    */
  //   else if (generator instanceof UUIDV5) {
  //     /**
  //      * First argument is the seed, second argument is the namespace.
  //      */
  //     object[field] = v5(object[field], generator.getNamespace());
  //   }

  //   /**
  //    * If no algorithm was set then we should return the field by default.
  //    */
  //   return object[field];
  // }
}