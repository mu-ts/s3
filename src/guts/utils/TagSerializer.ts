export class TagSerializer {

  private readonly tagFields?: string[];

  constructor(metadata: Record<string, any> | undefined) {
    this.tagFields = metadata?.['tags'];
  }

  public serializeMetadata(name: string, value: any | undefined): any {
    if (!this.tagFields || value === undefined) return value;

    const taggedField: string | undefined = this.tagFields.find((field: string) => field === name);

    if (taggedField) return value;
    return undefined;
  }

  public serializeBody(name: string, value: any | undefined): any {
    if (!this.tagFields || value === undefined) return value;

    const taggedField: string | undefined = this.tagFields.find((field: string) => field === name);

    if (taggedField) return undefined;
    return value;
  }
}