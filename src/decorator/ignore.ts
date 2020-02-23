import { Registry } from '../service/Registry';

/**
 * Indicates that a field should be ignored.
 */
export function ignore(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Registry.register(target.constructor.name, { ignore: [propertyKey] });
    return descriptor;
  };
}
