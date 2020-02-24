import { Metadata } from '../service/Metadata';

/**
 * Indicates that field is to be saved as a tag, rather than within the body.
 */
export function tag(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    Metadata.set(target, { tag: [propertyKey] });
    return descriptor;
  };
}
