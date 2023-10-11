import { expect } from 'chai';
import { describe, it } from 'mocha';

import { tag } from '../../src/objects/decorators/tag';
import { bucket } from '../../src/objects/decorators/bucket';

describe('@tag', () => {
  it('to decorate a field', () => {
    
    @bucket('test')
    class User {
      @tag
      public tagged: string = 'em'
    }

    expect(User['mu-ts']).to.have.property('tags').to.deep.include('tagged');
  })
})

