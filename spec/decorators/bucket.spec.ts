import { expect } from 'chai';
import { describe, it } from 'mocha';

import { bucket } from '../../src/decorators/bucket';
import { BucketService } from '../../src/sugar/guts/BucketService';

describe('@bucket', () => {
  it('to decorate class', () => {
    
    @bucket('test')
    class User {}

    expect(User[BucketService.PREFIX]).to.have.property('bucket').that.equals('test');
  })
})

