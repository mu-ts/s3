import { Registry } from '../service/Registry';

/**
 * Indicates that field is to be saved as a tag, rather than within the body.
 */
export function tag(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Registry.register(target.constructor.name, { tag: [propertyKey] });
    return descriptor;
  };
}
