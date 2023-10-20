import { BucketService } from '../sugar/guts/BucketService';

export const KEY: string = 'id'

/**
 * An attribute marked as ignored will not be persisted.
 */
export function id(originalMethod: any, context: ClassFieldDecoratorContext): void {
  context.addInitializer(function (): void {
    const { name } = context;
    const metadata = this.constructor[BucketService.PREFIX];
    if (metadata) metadata[KEY] = name;
  })
};
