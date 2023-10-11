interface FieldEncoding { name:string, encoding?: BufferEncoding }

export class DecodeDeserializer {

  private readonly encodeFields?: FieldEncoding[];

  constructor(metadata: Record<string, any> | undefined) {
    this.encodeFields = metadata?.['encode'];
  }

  public deserialize(name: string, value: any | undefined): any {
    if (!this.encodeFields || !value) return value;

    const encryptionField: FieldEncoding | undefined = this.encodeFields.find((field: FieldEncoding) => field.name === name);

    if (encryptionField) {
      const { encoding } = encryptionField;
      return Buffer.from(value, encoding || 'hex').toString('utf8');
    }

    return value;
  }
}