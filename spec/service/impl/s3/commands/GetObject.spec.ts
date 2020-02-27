import 'mocha';
import { createSandbox, stub, mock } from 'sinon';
import { expect } from 'chai';

// import { GetObjectOutput } from 'aws-sdk/clients/s3';
import S3 = require('aws-sdk/clients/s3');

import { GetObject } from '../../../../../src/service/impl/s3/commands/GetObject';
import { Collection } from '../../../../../src/model/Collection';
import { Request, AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

describe('GetObject', () => {
  describe('new()', () => {
    let sandbox: sinon.SinonSandbox;
    let s3: S3;

    beforeEach(() => {
      sandbox = createSandbox();
      s3 = new S3({ endpoint: 'localhost', maxRetries: 1, httpOptions: { timeout: 1 } });
    });

    afterEach(() => {
      sandbox.restore();
    });
    it('should create', () => expect(() => new GetObject(s3)).to.not.throw(Error));
  });

  describe('do()', () => {
    let sandbox: sinon.SinonSandbox;
    let s3: S3;
    let getObject: GetObject;
    let collection: Collection;

    beforeEach(() => {
      sandbox = createSandbox();
      s3 = new S3({ endpoint: 'localhost', maxRetries: 1, httpOptions: { timeout: 1 } });
      getObject = new GetObject(s3);
      collection = mock({
        'bucket.name': 'testo:bucket-o',
      }) as Collection;
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('success when exists', async () => {
      const response: Request<S3.GetObjectOutput, AWSError> = new Request<S3.GetObjectOutput, AWSError>(s3, 'getObject');

      const body: Buffer = Buffer.from('{"var":"my body"}', 'utf8');
      stub(response, 'promise').resolves({
        Body: body,
        StorageClass: 'test',
        ContentLength: 10,
        LastModified: new Date(),
        ETag: '"test"',
        ServerSideEncryption: 'AES256',
        VersionId: '12',
      } as PromiseResult<S3.GetObjectOutput, AWSError>);

      stub(s3, 'getObject').returns(response);

      const result: any = await getObject.do(collection, 'boo');

      expect(result).to.not.be.undefined;
      expect(result)
        .to.have.property('Body')
        .that.equals(body);
      expect(result)
        .to.have.property('Metadata')
        .that.has.property('ContentLength')
        .that.equals(10);
    });
  });
});
