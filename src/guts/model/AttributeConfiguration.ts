export interface AttributeConfiguration {
  encrypted?: boolean;
  encryptSecret?: string;

  encoded?: boolean;
  encoding?: BufferEncoding;

  ignored?: boolean;

  tag?: boolean;
}