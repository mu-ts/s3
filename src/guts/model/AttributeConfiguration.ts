export interface AttributeConfiguration {
  encrypted?: boolean;
  encryptSecret?: string;
  encoded?: boolean;
  encoding?: BufferEncoding;
  encodingAlgorithm?: string;
  ignored?: boolean;
  tag?: boolean;
}