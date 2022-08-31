import { ListObjectVersionsRequest, ListObjectVersionsCommand, ListObjectVersionsOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export const listObjectVersions = async ( input: ListObjectVersionsRequest): Promise<ListObjectVersionsOutput> => {
  preRequest(input);
  
  const command: ListObjectVersionsCommand = new ListObjectVersionsCommand(input);
  const response: ListObjectVersionsOutput = await client.send(command);

  return response;
}
