/**
 * Marks an attribute as an S3, SQS or SNS attribute. meaning when the object is added, published
 * or saved it will take any value decorated and push it to the 'metadata' equivalent.
 */
export function tag(originalMethod: any, context: ClassFieldDecoratorContext): void {
  context.addInitializer(function (): void {
    const { name } = context;
    const metadata = this.constructor['mu-ts'];
    if (metadata) {
      if (!metadata['tags']) metadata['tags'] = [];
      metadata['tags'].push(name)
    }
  })
};