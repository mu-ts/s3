# s3

Simple functional wrapper around S3 SDK to make most S3 interactions a single function call.

Influenced by https://github.com/matt-filion/s3-db

# Usage

I really hope you already know how to NPM install something. So we will skip that. This also gets rid of the need for being a developer elitist throughout the rest of the doc!

Example of loading an object from S3 and parsing it as JSON.

```

import { configure, getObject } from '@mu-ts/s3';

/**
 * This is not needed if running in lambda, as the region will be resolved via `process.env`.
 */
configure({region: 'us-east-1'});

const { Body } = await getObject({ Bucket: 'my.lil.bucky', Key: '8765309' });
const guts: object = JSON.parse(Body);

```

## Set Bucket

Sometimes you will have a chain of operations on the same bucket, as the entire scope of execution. In those cases you can use `setBucket` which will globally define the bucket for each request (if one is not provided).


```

import { configure, setBucket, getObject } from '@mu-ts/s3';

/**
 * This is not needed if running in lambda, as the region will be resolved via `process.env`.
 */
configure({region: 'us-east-1'});

/**
 * Set the bucket globally
 */
setBucket('my.lil.bucky');

/**
 * Omit the Bucket attribute from each request.
 */
const { Body } = await getObject({ Key: '8765309' });
const guts: object = JSON.parse(Body);

delete guts.thing;

/**
 * Omit the Bucket attribute from each request.
 */
const { VersionId } = await putObject({ Key: '8765309', Body: JSON.stringify(guts) });

```

## API's

The AWS sdk input/output interfaces are fully referenced and respected. However since we make use of Partial so that Bucket can be defaulted, you will need to do your own work to ensure that you are providing all required attributes.

* copyObject
* deleteObject
* getObject
* headObject
* listObjects
* listObjectsV2
* listObjectsV2Stream
* listVersions
* listVersionsStream
* putObject
* putObjectStream
* restoreObject
* restoreObjectStream
* selectObjectContent