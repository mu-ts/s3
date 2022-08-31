import { Readable } from "stream";
import { listObjectVersions } from "./listVersions";

class ListVersionReadable extends Readable {

  private continuationToken: string | undefined;

  constructor(
    private readonly bucket: string,
    private readonly prefix?: string,
    private readonly batchSize?: number
  ) {
    super({ objectMode: true });
  }

  async _read(): Promise<void> {

    do {
      console.log('reading', 1000);

      const { Versions, KeyMarker } = await listObjectVersions({ Bucket: this.bucket, Prefix: this.prefix, KeyMarker: this.continuationToken, MaxKeys: this.batchSize || 1000 });

      Versions.forEach((object: any) => this.push(object));

      this.continuationToken = KeyMarker;
    } while (this.continuationToken);
  }
}

export const listVersionsStream = (bucket: string, prefix?: string, batchSize?: number) => new ListVersionReadable(bucket, prefix, batchSize);