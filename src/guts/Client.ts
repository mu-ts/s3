import {
  S3Client, ServiceInputTypes, ServiceOutputTypes,  
} from "@aws-sdk/client-s3";
import { Logger } from "../utils/Logger";
import { Serializer } from "./Serializer";

export class Client {
  private static _instance: Client;

  private readonly client: S3Client;

  private readonly serializer: Serializer;

  private constructor() {
    this.client = new S3Client({ region: process.env.REGION || process.env.AWS_REGION || process.env.AWS_LAMBDA_REGION });
    this.serializer = new Serializer();
  }

  public async send<Input extends ServiceInputTypes, Output extends ServiceOutputTypes>(command: Input): Promise<Output> {
    Logger.trace('send()', 'input', { command });
    const response: Output = await this.client.send<Input, Output>(command as any);
    Logger.trace('send()', 'response', { response });
    return response;
  }

  public getSerializer(): Serializer {
    return this.serializer;
  }

  public static instance() {
    if (this._instance) return this._instance;
    this._instance = new Client();
    return this._instance;
  }
}