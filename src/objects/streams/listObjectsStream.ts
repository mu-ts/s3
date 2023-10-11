import { Readable } from "stream";
import { listObjects } from "../listObjects";
import { Objects } from "../model/Objects";
import { ObjectKey } from "../model/ObjectKey";
import { getObject } from "../getObject";
import { Constructor } from "../../guts/model/Constructor";

class ListObjectsStream<T> extends Readable {
  private continuationToken?: string;

  constructor(private readonly bucket: Constructor, private readonly prefix?: string, private readonly loadObjects?: boolean) {
    super({objectMode: true});
  }

  _read(size: number): void {
    listObjects(this.bucket, this.prefix, size, this.continuationToken)
      .then((objects: Objects | undefined) => {
        if(objects) {
          this.continuationToken = objects.getContinuationToken();
          objects.getResults().forEach((key: ObjectKey) => {
            if(this.loadObjects) {
              getObject(key.getKey(), this.bucket, key.getVersion()).then((object: any) => this.push(object))
            } else {
              this.push(key);
            }
          })
        }
      })
  }
}

export function listObjectsStream<T extends Function>(bucket: Constructor, prefix?: string, loadObjects?: boolean): ListObjectsStream<T> {
  return new ListObjectsStream(bucket, prefix, loadObjects);  
}