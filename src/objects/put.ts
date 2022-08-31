import { PutObjectCommandInput, PutObjectCommand, PutObjectOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export const putObject = async ( input: PutObjectCommandInput): Promise<PutObjectOutput> => {
  preRequest(input);
  
  const command: PutObjectCommand = new PutObjectCommand(input);
  const response: PutObjectOutput = await client.send(command);

  return response;
}
