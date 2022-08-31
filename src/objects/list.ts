import { ListObjectsRequest, ListObjectsCommand, ListObjectsOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export const listObjects = async ( input: ListObjectsRequest): Promise<ListObjectsOutput> => {
  preRequest(input);
  
  const command: ListObjectsCommand = new ListObjectsCommand(input);
  const response: ListObjectsOutput = await client.send(command);

  return response;
}
