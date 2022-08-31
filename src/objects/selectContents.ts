import { SelectObjectContentCommandInput, SelectObjectContentCommand, SelectObjectContentOutput  } from "@aws-sdk/client-s3";
import { client, preRequest } from '../utils/configure';

export async function selectObjectContent(input: Partial<SelectObjectContentCommandInput>): Promise<SelectObjectContentOutput> {
  preRequest(input);
  
  const command: SelectObjectContentCommand = new SelectObjectContentCommand(input as SelectObjectContentCommandInput);
  const response: SelectObjectContentOutput = await client.send(command);

  return response;
}
