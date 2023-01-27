import { v5, v4 } from 'uuid';
import { IDGenerator } from './model/IDGenerator';
import { UUIDV5 } from './model/UUIDV5';

export class ID {
  private constructor() {
  }

  public static generate(
    bucket: string,
    instance: Record<string, any>,
    attribute: string,
    strategy?: string | IDGenerator | UUIDV5): string {
    if (strategy === 'uuid') return v4();
    /**
     * UUID5 gives a deterministic UUID based on the namespace provdied.
     */
    if (strategy instanceof UUIDV5) {
      /**
       * First argument is the seed, second argument is the namespace.
       */
      return v5(
        instance[attribute],
        strategy.getNamespace() || bucket
      );
    }
    if (typeof strategy === 'function') return strategy(instance);
    return instance[attribute]! as string;
  }
}