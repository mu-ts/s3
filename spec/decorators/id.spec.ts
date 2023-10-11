import { v4 } from 'uuid';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { id } from '../../src/objects/decorators/id';
import { bucket } from '../../src/objects/decorators/bucket';
import { UUIDV5 } from '../../src/guts/model/UUIDV5';

describe('@id', () => {
  it('to decorate field as id', () => {
    
    @bucket('test')
    class User {
      @id()
      public key: string;
    }

    expect(User['mu-ts']).to.have.property('id').that.has.property('field').that.equals('key')
    expect(User['mu-ts']).to.have.property('id').that.has.property('generator').that.equals(undefined)
  })

  it('to decorate field with uuid v4', () => {
    
    @bucket('test')
    class User {
      @id('uuid')
      public key: string;
    }

    expect(User['mu-ts']).to.have.property('id').that.has.property('field').that.equals('key')
    expect(User['mu-ts']).to.have.property('id').that.has.property('generator').that.equals('uuid')
  })

  it('to decorate field with custom generator', () => {
    const idGenerator = <User>(user: User) => 'hi';
    @bucket('test')
    class User {
      @id(idGenerator)
      public key: string;
    }

    expect(User['mu-ts']).to.have.property('id').that.has.property('field').that.equals('key')
    expect(User['mu-ts']).to.have.property('id').that.has.property('generator').that.equals(idGenerator)
  })

  it('to decorate field with v5', () => {
    const namespace: string = v4();
    const uuidV5: UUIDV5 = new UUIDV5(namespace);

    @bucket('test')
    class User {
      @id(uuidV5)
      public key: string;
    }

    expect(User['mu-ts']).to.have.property('id').that.has.property('field').that.equals('key')
    expect(User['mu-ts']).to.have.property('id').that.has.property('generator').to.deep.equal(uuidV5)
  })
})

