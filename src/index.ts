import { Operations } from './service/Operations';
import { S3Operations } from './service/impl/S3Operations';
import { S3Facade } from './service/impl/S3Facade';
import { JSONSerializerService } from './service/impl/JSONSerializerService';
import { CollectionRegistryImpl } from './service/impl/CollectionRegistryImpl';
import { DocumentDecoratorImpl } from './service/impl/DocumentDecoratorImpl';
import { Diacritics } from './service/impl/Diacritics';

const operations: Operations = new S3Operations(
  S3Facade.s3,
  new JSONSerializerService(),
  new CollectionRegistryImpl(),
  new DocumentDecoratorImpl(),
  new Diacritics()
);

export const copy = operations.copy;
export const get = operations.get;
export const head = operations.head;
export const list = operations.list;
export const put = operations.put;
export const remove = operations.remove;

export const safe = operations.safe;
