import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { encode } from '../../src/decorators/encode';
import { bucket } from '../../src/decorators/bucket';
import { BucketRegistry } from '../../src/guts/BucketRegistry';
import { AttributeConfiguration } from '../../src/guts/model/AttributeConfiguration';

@suite
export class EncodeSpec {
  @test
  public decorate(): void {
    class EncodeUser{
      @encode()
      public test: string = '';
    }
    const attributes: AttributeConfiguration = BucketRegistry.getAttributes(EncodeUser, 'test');
    expect(attributes).to.have.property('encoded').that.is.true;
  }

  @test
  public decorateWithBucket(): void {
    @bucket('test-bucket')
    class EncodeUser{
      @encode()
      public test: string = '';
    }
    const attributes: AttributeConfiguration = BucketRegistry.getAttributes(EncodeUser, 'test');
    expect(attributes).to.have.property('encoded').that.is.true;
  }

  @test
  public decorateBase64(): void {
    class EncodeUser{
      @encode('base64')
      public test: string = '';
    }
    const attributes: AttributeConfiguration = BucketRegistry.getAttributes(EncodeUser, 'test');
    expect(attributes).to.have.property('encoded').that.is.true;
    expect(attributes).to.have.property('encoding').to.equal('base64');
  }
}
