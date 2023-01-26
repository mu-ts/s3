import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { tag } from '../../src/objects/decorators/tag';
import { BucketRegistry } from '../../src/guts/BucketRegistry';
import { AttributeConfiguration } from '../../src/guts/model/AttributeConfiguration';

@suite
export class TagSpec {
  @test
  public decorate(): void {
    class IgnoreUser {
      @tag()
      public test: string = '';
    }
    const attributes: AttributeConfiguration = BucketRegistry.getAttributes(IgnoreUser, 'test');
    expect(attributes).to.have.property('tag').that.is.true;
  }
}
