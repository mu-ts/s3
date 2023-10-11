import { Decipher, createDecipheriv, CipherCCMTypes, CipherOCBTypes, CipherGCMTypes } from 'crypto';

interface FieldEncryption { name:string, secret: string, algorithm?: CipherCCMTypes | CipherOCBTypes | CipherGCMTypes | string }

export class DecryptSerializer {

  private readonly encryptedFields?: FieldEncryption[];

  constructor(metadata: Record<string, any> | undefined) {
    this.encryptedFields = metadata?.['encrypt'];
  }

  public deserialize(name: string, _value: any | undefined): any {
    if (!this.encryptedFields || !_value) return _value;

    const encryptionField: FieldEncryption | undefined = this.encryptedFields.find((field: FieldEncryption) => field.name === name);

    if (encryptionField) {
      const secret: Buffer = Buffer.from(encryptionField.secret as string);
      const [iv, value] = _value.split('.');
      const cipher: Decipher = createDecipheriv(encryptionField.algorithm || 'aes-256-cbc', secret, Buffer.from(iv, 'hex'));
      const decrypted: Buffer = cipher.update(Buffer.from(value, 'hex'));

      return Buffer.concat([decrypted, cipher.final()]).toString('utf8');
    }

    return _value;
  }
}