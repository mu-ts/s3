import { expect } from 'chai';
import { describe, it } from 'mocha';

import { uuid } from '@mu-ts/serialization'

import { BucketService } from '../../src/sugar/guts/BucketService';
import { bucket } from '../../src/decorators/bucket';
import { id } from '../../src/decorators/id';

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
    it('using a default keys', () => {
      expect(BucketService.getId('{ "_id": "test" }', {})).to.equal('test');
      expect(BucketService.getId('{ "id": "test" }', {})).to.equal('test');
      expect(BucketService.getId('{ "key": "test" }', {})).to.equal('test');
      expect(BucketService.getId('{ "Key": "test" }', {})).to.equal('test');
    })
    
    it('using decorated class', () => {
      @bucket('test-user')
      class User {
        @id
        field: string;
      }

      expect(BucketService.getId('{"field": "someid"}', new User() )).to.equal('someid')

    })
  });
})

