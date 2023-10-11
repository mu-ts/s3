interface FieldEncoding { name:string, encoding?: BufferEncoding }

export class EncodeSerializer {

  private readonly encodeFields?: FieldEncoding[];

  constructor(metadata: Record<string, any> | undefined) {
    this.encodeFields = metadata?.['encode'];
  }

  public serialize(name: string, value: any | undefined): any {
    if (!this.encodeFields || value === undefined) return value;

    const encryptionField: FieldEncoding | undefined = this.encodeFields.find((field: FieldEncoding) => field.name === name);

    if (encryptionField) {
      const { encoding } = encryptionField;
      return Buffer.from(value, 'utf8').toString(encoding || 'hex');
    }

    return value;
  }
}