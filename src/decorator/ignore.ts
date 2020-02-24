import { Metadata } from '../service/Metadata';

/**
 * Indicates that a field should be ignored.
 */
export function ignore(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Metadata.set(target, { ignore: [propertyKey] });
    return descriptor;
  };
}
