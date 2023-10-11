/**
 * Used to mark a class to store its instances in a specific bucket.
 * 
 * @param name of the bucket for a class to persist its objects within.
 * @returns 
 */
export function bucket(name: string): any {
  return function bucketDecorator(target: any, context: ClassMethodDecoratorContext): typeof Function | void {
    context.addInitializer(function (this: any) {
      this['mu-ts'] = this['mu-ts'] ? this['mu-ts'].bucket = name : { bucket: name }
      /**
       * Creating an instance of the underlying class ensures that the field
       * and attribute level decorators will get picked up.
       */
      new this();
    })
  };
}
  