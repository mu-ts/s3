import { expect } from 'chai';
import { describe, it } from 'mocha';

import { encode } from '../../src/objects/decorators/encode';
import { bucket } from '../../src/objects/decorators/bucket';


describe('@encode', () => {
  it('to decorate class with basic encode, with bucket', () => {
    @bucket('test-bucket')
    class EncodeUser{
      @encode()
      public test: string = '';
    }

    const attributes: {name: string, encoding: string } = EncodeUser['mu-ts'].encode;

    expect(attributes[0]).to.have.property('name').that.equals('test');
  })

  it('to decorate class with base64 and bucket', () => {
    @bucket('test-bucket')
    class EncodeUser{
      @encode('base64')
      public test: string = '';
    }
    
    const attributes: {name: string, encoding: string } = EncodeUser['mu-ts'].encode;

    expect(attributes[0]).to.have.property('name').that.equals('test');
    expect(attributes[0]).to.have.property('encoding').to.equal('base64');
  })
})
