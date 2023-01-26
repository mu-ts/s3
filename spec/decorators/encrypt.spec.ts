import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { encrypt } from '../../src/objects/decorators/encrypt';
import { bucket } from '../../src/objects/decorators/bucket';
import { BucketRegistry } from '../../src/guts/BucketRegistry';
import { AttributeConfiguration } from '../../src/guts/model/AttributeConfiguration';

@suite
export class EncryptSpec {
  @test
  public decorate(): void {
    class EcnryptUser {
      @encrypt('little')
      public test: string = '';
    }
    const attributes: AttributeConfiguration = BucketRegistry.getAttributes(EcnryptUser, 'test');
    expect(attributes).to.have.property('encrypted').that.is.true;
    expect(attributes).to.have.property('encryptSecret').to.equal('little');
  }

  @test
  public decorateWithBucket(): void {
    @bucket('test-bucket')
    class EcnryptUser {
      @encrypt('little')
      public test: string = '';
    }
    const attributes: AttributeConfiguration = BucketRegistry.getAttributes(EcnryptUser, 'test');
    expect(attributes).to.have.property('encrypted').that.is.true;
    expect(attributes).to.have.property('encryptSecret').to.equal('little');
  }
}
