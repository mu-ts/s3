import { createHash } from 'crypto';

export class MD5 {
  private constructor() {
  }

  public static generate(base: string): string { 
    return createHash('md5')
      .update(base)
      .digest('base64')
  }
}