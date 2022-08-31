import { RestoreObjectCommandInput, RestoreObjectCommand, RestoreObjectOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export const restoreObject = async ( input: RestoreObjectCommandInput): Promise<RestoreObjectOutput> => {
  preRequest(input);
  
  const command: RestoreObjectCommand = new RestoreObjectCommand(input);
  const response: RestoreObjectOutput = await client.send(command);

  return response;
}
