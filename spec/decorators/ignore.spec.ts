
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { ignore } from '../../src/objects/decorators/ignore';
import { bucket } from '../../src/objects/decorators/bucket';

describe('@ignore', () => {
  it('to decorate a field', () => {
    
    @bucket('test')
    class User {
      @ignore
      public ignore: string = 'em'
    }

    expect(User['mu-ts']).to.have.property('ignore').to.deep.include('ignore');
  })
})

