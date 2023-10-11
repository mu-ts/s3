export class IgnoreSerializer {

  private readonly ignoredFields?: string[];

  constructor(metadata: Record<string, any> | undefined) {
    this.ignoredFields = metadata?.['ignore'];
  }

  public serialize(name: string, value: any | undefined): any {
    if (!this.ignoredFields || value === undefined) return value;
    
    const ignoreField: string | undefined = this.ignoredFields.find((field: string) => field === name);

    if (ignoreField) return undefined;
    return value;
  }
}