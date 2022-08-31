import { CopyObjectCommandInput, CopyObjectCommand, CopyObjectOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export async function CopyObject(input: Partial<CopyObjectCommandInput>): Promise<CopyObjectOutput> {
  preRequest(input);

  const command: CopyObjectCommand = new CopyObjectCommand(input as CopyObjectCommandInput);
  const response: CopyObjectOutput = await client.send(command);

  return response;
}
