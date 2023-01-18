import {
  DeleteObjectCommand, DeleteObjectCommandOutput,
  GetObjectCommand, GetObjectCommandOutput,
  HeadObjectCommand, HeadObjectOutput,
  PutObjectCommand, PutObjectOutput,
  S3Client
} from "@aws-sdk/client-s3";
import { Serializer } from "./Serializer";

type CommandInput = DeleteObjectCommand | GetObjectCommand | HeadObjectCommand | PutObjectCommand;
type CommandOutput = DeleteObjectCommandOutput | GetObjectCommandOutput | HeadObjectOutput | PutObjectOutput;

export class Client {
  private static _instance: Client;

  private readonly client: S3Client;

  private readonly serializer: Serializer;

  private constructor() {
    this.client = new S3Client({ region: process.env.REGION || process.env.AWS_REGION || process.env.AWS_LAMBDA_REGION });
    this.serializer = new Serializer();
  }

  public async send(command: CommandInput): Promise<CommandOutput> {
    const response: CommandOutput = await this.client.send(command);
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