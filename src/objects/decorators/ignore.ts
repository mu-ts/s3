/**
 * An attribute marked as ignored will not be persisted.
 */
export function ignore(originalMethod: any, context: ClassFieldDecoratorContext): void {
  context.addInitializer(function (): void {
    const { name } = context;
    const metadata = this.constructor['mu-ts'];
    if (metadata) {
      if (!metadata['ignore']) metadata['ignore'] = [];
      metadata['ignore'].push(name)
    }
  })
};
