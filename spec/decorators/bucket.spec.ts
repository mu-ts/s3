import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { bucket } from '../../src/decorators/bucket';
import { BucketRegistry } from '../../src/guts/BucketRegistry';

@suite
export class BucketSpec {
  @test
  public decorate(): void {
   
    @bucket('test')
    class User {}

    const bucketName: string = BucketRegistry.getBucketName(User);

    expect(bucketName).to.equal('test');
  }

}
