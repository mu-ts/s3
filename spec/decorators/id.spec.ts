import { expect } from 'chai';
import { describe, it } from 'mocha';

import { id } from '../../src/decorators/id';
import { bucket } from '../../src/decorators/bucket';
import { BucketService } from '../../src/sugar/guts/BucketService';


describe('@id', () => {
  it('to decorate field as id', () => {
    
    @bucket('test')
    class User {
      @id
      public key: string;
    }

    expect(User[BucketService.PREFIX]).to.have.property('id').that.deep.equals( 'key' )
  })
})

