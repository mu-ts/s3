import { CipherCCMTypes, CipherGCMTypes, CipherOCBTypes } from "crypto";

/**
 * Marks an attribute to have ist value encrypted. Encryption happens before
 * encoding during serialization.
 * 
 * @param secret used to encrypt the value.
 * @returns 
 */
export function encrypt(secret: string, algorithm: CipherCCMTypes | CipherOCBTypes | CipherGCMTypes | string = 'aes-256-cbc'): any {
  return function encryptDecorator(originalMethod: any, context: ClassFieldDecoratorContext): void {
    context.addInitializer(function (): void {
      const { name } = context;
      const metadata = this.constructor['mu-ts'];
      if (metadata) {
        if (!metadata['encrypt']) metadata['encrypt'] = [];
        metadata['encrypt'].push({ name, secret, algorithm })
      }
    })
  };
}
