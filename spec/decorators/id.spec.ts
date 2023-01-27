import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { id } from '../../src/objects/decorators/id';
import { BucketRegistry } from '../../src/guts/BucketRegistry';
import { UUIDV5 } from '../../src/guts/model/UUIDV5';
import { IDGenerator } from '../../src/guts/model/IDGenerator';

@suite
export class IdSpec {
  @test
  public decorateUUID(): void {
    class IDUser {
      @id('uuid')
      public test: string = '';
    }
    const {attribute, strategy} = BucketRegistry.getId(IDUser);
    expect(attribute).to.equal('test');
    expect(strategy).to.equal('uuid');
  }

  @test
  public decorateUUIDV5(): void {
    class IDUser {
      @id(new UUIDV5('con-seed'))
      public test: string = '';
    }
    const {attribute, strategy} = BucketRegistry.getId(IDUser);
    expect(attribute).to.equal('test');
    expect(strategy).to.be.instanceOf(UUIDV5);
  }

  @test
  public decorateIDGenerator(): void {
    class IDUser {
      @id(((user: IDUser) => 'id-1') as IDGenerator)
      public test: string = '';

    }
    const {attribute, strategy} = BucketRegistry.getId(IDUser);
    expect(attribute).to.equal('test');
    expect(typeof strategy).to.equal('function')
  }
}
