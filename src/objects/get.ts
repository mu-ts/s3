import { GetObjectCommandInput, GetObjectCommand, GetObjectOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export async function getObject(input: Partial<GetObjectCommandInput>): Promise<GetObjectOutput> {

  preRequest(input);
  
  const command: GetObjectCommand = new GetObjectCommand(input as GetObjectCommandInput);
  const response: GetObjectOutput = await client.send(command);

  return response;
}
