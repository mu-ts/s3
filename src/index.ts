import { GetObject } from './s3/GetObject';
import { Configuration } from './service/Configuration';
import { S3Facade } from './service/S3Facade';
import { Deserialize } from './model/Deserialize';

const getIt: GetObject = new GetObject(S3Facade.s3, Configuration.get('DESERIALIZER') as Deserialize);

export const get = getIt.do;
