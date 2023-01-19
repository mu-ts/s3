import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { deleteObject } from '../../src/objects/deleteObject';
import { Client } from '../../src/guts/Client';
import { MockClient } from '../mock/MockClient';
import { DeleteObjectCommandOutput } from '@aws-sdk/client-s3';

@suite
export class DeleteObjectSpec {

  @test
  public async noVersionByBucket(): Promise<void> {
    Client.instance = () => new MockClient({ VersionId: undefined } as DeleteObjectCommandOutput) as any as Client;
    const versionId: string | undefined = await deleteObject('id', 'some-buket');
    expect(versionId).to.be.undefined;
  }

}
