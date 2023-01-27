import { test, suite } from '@testdeck/mocha';
import { expect } from 'chai';
import { BucketRegistry } from '../../../src/guts/BucketRegistry';

@suite
export class BucketRegistrySpec {
 
  @test
  public register(): void {
    class BucketRegistryClazz {
    }
    BucketRegistry.register(BucketRegistryClazz, 'test-bucket-registry');
    expect(BucketRegistry.getBucketName(BucketRegistryClazz)).to.equal('test-bucket-registry');
    expect(BucketRegistry.getClazz('test-bucket-registry')).to.not.be.undefined;
  }

  @test
  public attributes(): void {
    class BucketRegistryClazz {
    }
    BucketRegistry.setAttributes(BucketRegistryClazz, 'name', { ignored: true });
    expect(BucketRegistry.getAttributes(BucketRegistryClazz, 'name')).to.have.property('ignored').that.equals(true)
  }

  @test
  public id(): void {
    class BucketRegistryClazz {};
    BucketRegistry.setId(BucketRegistryClazz, 'name', 'uuid');
    const { attribute, strategy } = BucketRegistry.getId(BucketRegistryClazz);
    expect(attribute).to.equal('name');
    expect(strategy).to.equal('uuid');
  }
}
