interface FieldEncoding { name:string, encoding?: BufferEncoding }

export class DateDeserializer {
  private readonly dateRegex: RegExp;

  constructor(metadata: Record<string, any> | undefined) {  
    this.dateRegex = new RegExp(/(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?/g);
  }

  public deserialize(name: string, value: any | undefined): any {
    if (typeof value === 'string' && this.dateRegex.test(value)) {
      const date: Date = new Date(value);
      return date.toString() === 'Invalid Date' ? value : date;
    }
    return value;
  }
}