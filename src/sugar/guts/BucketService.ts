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
}