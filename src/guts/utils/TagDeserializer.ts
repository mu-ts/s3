export class TagDeserializer {

  private readonly tagFields?: string[];

  constructor(metadata: Record<string, any> | undefined) {
    this.tagFields = metadata?.['tags'];
  }

  // public deserialize(name: string, value: any | undefined): any {
  public deserializeMetadata(name: string, value: any | undefined): any {
    if (!this.tagFields || value === undefined) return value;

    const taggedField: string | undefined = this.tagFields.find((field: string) => field === name);

    if (taggedField) return value;
    return undefined;
  }

}