import { expect } from 'chai';
import { describe, it } from 'mocha';

import { encrypt } from '../../src/objects/decorators/encrypt';
import { bucket } from '../../src/objects/decorators/bucket';

describe('@encrypt', () => {
  it('to decorate field', () => {
    
    @bucket('test')
    class User {
      @encrypt('SuperSecretSecret')
      public test: string = '';
    }

    expect(User['mu-ts']).to.have.property('encrypt').to.deep.include({ field: 'test', secret: 'SuperSecretSecret', algorithm: 'aes-256-cbc'});
  })

  it('to decorate field with an algorithm', () => {
    
    @bucket('test')
    class User {
      @encrypt('SuperSecretSecret', "aes-256-ccm")
      public test: string = '';
    }

    expect(User['mu-ts']).to.have.property('encrypt').to.deep.include({ field: 'test', secret: 'SuperSecretSecret', algorithm: 'aes-256-ccm'});
  })
})
