export function setClassProperty(constructor: Function, key: string, value: string): void {
  Object.defineProperty(
    constructor, 
    key, 
    {
      value,
      configurable: false,
      enumerable: false,
      writable: false,
    }
  );
}

export function getClassProperty(constructor: Function, key: string): string | undefined {
  const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(constructor, key);
  if (descriptor) return descriptor.value;
  return undefined;
}