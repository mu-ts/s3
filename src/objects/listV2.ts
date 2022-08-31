import { ListObjectsV2Request, ListObjectsV2Command, ListObjectsV2Output  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export const listObjectsV2 = async ( input: ListObjectsV2Request): Promise<ListObjectsV2Output> => {
  preRequest(input);
  
  const command: ListObjectsV2Command = new ListObjectsV2Command(input);
  const response: ListObjectsV2Output = await client.send(command);

  return response;
}
