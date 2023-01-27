export class ObjectKey {
  constructor(
    private readonly bucket: string, 
    private readonly key: string, 
    private readonly lastModified: Date, 
    private readonly size: number, 
    private readonly eTag: string,
    private readonly version?: string){
  }

  getBucket(): string {
    return this.bucket;
  }
  
  getKey(): string {
    return this.key;
  }

  getLastModified(): Date {
    return this.lastModified;
  }

  getSize(): number {
    return this.size;
  }

  getETag(): string {
    return this.eTag;
  }

  getVersion(): string | undefined {
    return this.version;
  }
}
