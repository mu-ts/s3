import { S3Client, S3ClientConfig  } from "@aws-sdk/client-s3";

export let bucketName: string | undefined;

/**
 * Should work fine for Lambda.
 */
export let client: S3Client | undefined = new S3Client({ region: process.env.REGION ||  process.env.AWS_REGION || process.env.AWS_LAMBDA_REGION });

/**
 * 
 * @param configuration to use for S3.
 */
export const setConfiguration = (configuration: S3ClientConfig) => {
  client = new S3Client(configuration);
}

/**
 * 
 * @param request to set the 'default' bucket onto.
 */
export const setBucket = (name: string) => {
  bucketName = name;
}



/**
 * 
 * @param request to set the 'default' bucket onto.
 */
 export const preRequest = (request: {Bucket?: string}) => {
  if (!request.Bucket) request.Bucket = bucketName;
}

