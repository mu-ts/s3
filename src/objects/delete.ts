import { DeleteObjectCommandInput, DeleteObjectCommand, DeleteObjectOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export async function deleteObject(input: Partial<DeleteObjectCommandInput>): Promise<DeleteObjectOutput> {

  preRequest(input);

  const command: DeleteObjectCommand = new DeleteObjectCommand(input as DeleteObjectCommandInput);
  const response: DeleteObjectOutput = await client.send(command);

  return response;
}
