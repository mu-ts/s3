import { HeadObjectCommandInput, HeadObjectCommand, HeadObjectOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export async function headObject(input: Partial<HeadObjectCommandInput>): Promise<HeadObjectOutput> {
  preRequest(input);
  
  const command: HeadObjectCommand = new HeadObjectCommand(input as HeadObjectCommandInput);
  const response: HeadObjectOutput = await client.send(command);

  return response;
}
