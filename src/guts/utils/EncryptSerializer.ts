import { Cipher, createCipheriv, randomBytes, CipherCCMTypes, CipherOCBTypes, CipherGCMTypes } from 'crypto';

interface FieldEncryption { field:string, secret: string, algorithm?: CipherCCMTypes | CipherOCBTypes | CipherGCMTypes | string }

export class EncryptSerializer {

  private readonly encryptedFields?: FieldEncryption[];

  constructor(metadata: Record<string, any> | undefined) {
    this.encryptedFields = metadata?.['encrypt'];
  }

  public serialize(name: string, value: any | undefined): any {
    if (!this.encryptedFields || value === undefined) return value;

    const encryptionField: FieldEncryption | undefined = this.encryptedFields.find(({field}: FieldEncryption) => field === name);

    if (encryptionField) {
      const secret: Buffer = Buffer.from(encryptionField.secret);
      const iv: Buffer = randomBytes(16);
      const cipher: Cipher = createCipheriv(encryptionField.algorithm || 'aes-256-cbc', secret, iv);
      const encrypted: Buffer = cipher.update(value);

      return `${iv.toString('hex')}.${Buffer.concat([encrypted, cipher.final()]).toString('hex')}`;
    }

    return value;
  }
}