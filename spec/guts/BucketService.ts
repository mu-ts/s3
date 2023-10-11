import { expect } from 'chai';
import { describe, it } from 'mocha';

import { BucketService } from '../../src/guts/BucketService';
import { UUIDV5, bucket, id } from '../../src/objects';
import { v4, v5 } from 'uuid';

describe('BucketService', () => {
  describe('getName', () => {
    it('to return string', () => {
      expect(BucketService.getName('cdn.bucket.name')).to.equal('cdn.bucket.name');
    })

    it('to find from object', () => {
      @bucket('super.bucket.name')
      class User{}
      expect(BucketService.getName(new User())).to.equal('super.bucket.name');
    })

    it('to find from class', () => {
      @bucket('other.bucket.name')
      class User{}
      expect(BucketService.getName(User)).to.equal('other.bucket.name');
    })
  })

  
  describe('setKey', () => {
    it('to use a default field', () => {
      let user: any = { _id: 'test' };
      expect(BucketService.setKey(user)).to.deep.equal('test');

      user = { id: 'test' };
      expect(BucketService.setKey(user)).to.deep.equal('test');
      
      user = { key: 'test' };
      expect(BucketService.setKey(user)).to.deep.equal('test');
      
      user = { Key: 'test' };
      expect(BucketService.setKey(user)).to.deep.equal('test');
    })
    
    it('to generate a v4 uuid', () => {
      @bucket('test-user')
      class User {
        @id('uuid')
        field: string;
      }

      const user: User = new User();

      expect(BucketService.setKey(user)).that.is.not.undefined;
      expect(user).to.have.property('field').that.is.not.undefined;

    })
    
    it('to generate a v5 uuid', () => {
      const namespace: string = v4();
      @bucket('test-user')
      class User {
        @id(new UUIDV5(namespace))
        field: string = 'x'
      }

      const user: User = new User();

      expect(BucketService.setKey(user)).that.is.not.undefined;
      expect(user).to.have.property('field').that.equals(v5('x', namespace));
    })

    it('to generate a custom ID', () => {
      @bucket('test-user')
      class User {
        @id(<User>(user: User) => 'my-custom-id')
        field: string = 'x'
      }

      const user: User = new User();

      expect(BucketService.setKey(user)).that.is.not.undefined;
      expect(user).to.have.property('field').that.equals('my-custom-id')
    })
  });
})

