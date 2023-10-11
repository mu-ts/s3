import { expect } from 'chai';
import { describe, it } from 'mocha';

import { bucket } from '../../src/objects/decorators/bucket';

describe('@bucket', () => {
  it('to decorate class', () => {
    
    @bucket('test')
    class User {}

    expect(User['mu-ts']).to.have.property('bucket').that.equals('test');
  })
})

