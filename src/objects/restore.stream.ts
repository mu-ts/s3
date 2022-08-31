import { RestoreObjectCommandInput } from "@aws-sdk/client-s3";
import { Writable } from "stream";
import { restoreObject } from "./restore";

class RestoreObjectWritable extends Writable {

  private buffer: { input: RestoreObjectCommandInput, callback: Function}[];

  constructor(
    private readonly batchSize: number = 100
  ) {
    super({ objectMode: true });
    this.buffer = [];
  }

  async _write(input: RestoreObjectCommandInput, _encoding: BufferEncoding, callback: (error?: Error) => void): Promise<void> {

    this.buffer.push({ input, callback });

    if (this.buffer.length === this.batchSize) {
      await this.flush(this.buffer.slice());
      this.buffer = [];
    }
  }

  async _final(callback: (error?: Error) => void): Promise<void> {
    if (this.buffer.length == 0) {
      await this.flush(this.buffer.slice());
      this.buffer = [];
    }
    callback();
  }

  private async flush(toWrite: { input: RestoreObjectCommandInput, callback: Function}[]): Promise<any> {
    await Promise.all(
      toWrite.map( (line: {input: RestoreObjectCommandInput, callback: Function}) => {
        return restoreObject(line.input).then(()=> line.callback()).catch((error) => line.callback(error));
      })
    )
  }
}

export const restoreObjectStream = (batchSize?: number) => new RestoreObjectWritable(batchSize);