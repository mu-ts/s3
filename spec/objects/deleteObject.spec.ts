import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { DeleteObjectCommandOutput } from '@aws-sdk/client-s3';

import { bucket, deleteObject } from '../../src';
import { Client } from '../../src/guts/Client';
import { MockClient } from '../mock/MockClient';

@suite
export class DeleteObjectSpec {

  @test
  public async noVersionByBucket(): Promise<void> {
    Client.instance = () => new MockClient({ VersionId: undefined } as DeleteObjectCommandOutput) as any as Client;
    // @ts-ignore
    const versionId: string | undefined = await deleteObject('id', 'some-buket');
    expect(versionId).to.be.undefined;
  }

  @test
  public async versionByBucket(): Promise<void> {
    Client.instance = () => new MockClient({ VersionId: 'version-1' } as DeleteObjectCommandOutput) as any as Client;
    // @ts-ignore
    const versionId: string | undefined = await deleteObject('id', 'some-buket', 'version-1');
    expect(versionId).to.equal('version-1');
  }

  @test
  public async noVersionByClass(): Promise<void> {
    @bucket('delete-object-user')
    class DeleteObjectUser {
    }

    Client.instance = () => new MockClient({ VersionId: undefined } as DeleteObjectCommandOutput) as any as Client;
    const versionId: string | undefined = await deleteObject('id', DeleteObjectUser);
    expect(versionId).to.be.undefined;
  }

  @test
  public async versionByClass(): Promise<void> {
    @bucket('delete-object-user')
    class DeleteObjectUser {
    }

    Client.instance = () => new MockClient({ VersionId: 'version-1' } as DeleteObjectCommandOutput) as any as Client;
    const versionId: string | undefined = await deleteObject('id', DeleteObjectUser, 'version-1');
    expect(versionId).to.equal('version-1');
  }

}
