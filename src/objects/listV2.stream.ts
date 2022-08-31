import { Readable } from "stream";
import { listObjectsV2 } from "./listV2";

class ListObjectsReadable extends Readable {

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

      const { Contents, ContinuationToken } = await listObjectsV2({ Bucket: this.bucket, Prefix: this.prefix, ContinuationToken: this.continuationToken, MaxKeys: this.batchSize || 1000 });

      Contents!.forEach((object: any) => this.push(object));

      this.continuationToken = ContinuationToken;
    } while (this.continuationToken);
  }
}

export const listObjectsV2Stream = (bucket: string, prefix?: string, batchSize?: number) => new ListObjectsReadable(bucket, prefix, batchSize);