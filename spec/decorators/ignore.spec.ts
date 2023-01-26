import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { ignore } from '../../src/objects/decorators/ignore';
import { BucketRegistry } from '../../src/guts/BucketRegistry';
import { AttributeConfiguration } from '../../src/guts/model/AttributeConfiguration';

@suite
export class IgnoreSpec {
  @test
  public decorate(): void {
    class IgnoreUser {
      @ignore()
      public test: string = '';
    }
    const attributes: AttributeConfiguration = BucketRegistry.getAttributes(IgnoreUser, 'test');
    expect(attributes).to.have.property('ignored').that.is.true;
  }
}
