# Objective

Nice sugarry layer over top of S3 to make utilizing it psuedo database-like a bit easier. Uses @aws-sdk library which is more moduarlized so your deploy sizes should be smaller.

# Class Decoration

In orderto do all the neat behaviors around an objet, we need a class to associate the configurations with.

```
@bucket(process.env.BUCKET_NAME)
class User {
  @id('uuid')
  public id: string;

  public name: string;
  
  @encoded('base64')
  @encrypted('my-secret')
  public address: string;

  @tag()
  public group: string;

  @redacted()
  public hashId: string;
}
```

* @bucket() associates all instances of the class to the named bucket.
* @id(type) describes the single field that can be used for the ID, and how to generate the ID if none is provided. `uuid` for uuid v4 generation. An instance of UUIDV5('namespace-value') to use uuid v5, with the associated attribute as the seed for the key. Or, define a function that will be given the object, and output a string as the ID.
* @encrypt(secret) to have this field encrypted before it is persisted. Encoding happens after encryption if both are on the same field.
* @encoded(type) to have this field encoded before it is persisted. Encoding happens after encryption if both are on the same field.
* @tag() to remove this attribute from the body of the document and store as metadata instead.
* @redacted to never persist this value, in tags nor the serialized body.

## Behaviors

These are the commands you can use for interacting with an S3 bucket on a decorated object.

### putObject(object, Class?)

You can exclude the class if the object being persisted was created from a class.

```
import { putObject } from '@mu-ts/s3';

let user: User = new User();
user = await putObject(user);
```

If you created your object dreclty in JSON you will need to define the class used to persist.

```
import { putObject } from '@mu-ts/s3';

let user: User = { ... };
user = await putObject(user, User);
```

### getObject(id, Class, version?)

Load an object from S3 as an object.

```
import { getObject } from '@mu-ts/s3';

const user: User | undefined = await getObject(user, User);
```

If you want to return a specific version, you can specify that as well.

```
import { getObject } from '@mu-ts/s3';

const versionId: string = '...';
const user: User | undefined = await getObject(user, User, versionId);
```

### deleteObject(id, Class, version?)


Delete an object from S3. If a specific version is deleted (versioning enabled on bucket), then it is returned, undefined is returned otherwise.

```
import { deleteObject } from '@mu-ts/s3';

const versionId: string | undefined = await deleteObject(user, User);
```

If you want to delete a specific version, you can specify that as well.

```
import { getObject } from '@mu-ts/s3';

const versionId: string = '...';
const user: User | undefined = await deleteObject(user, User, versionId);
```

### headObject(id, Class, version?)

Load the metadata for an object, or get undefined if nothing is found.

```
import { headObject } from '@mu-ts/s3';

const metadata: Record<string, string> | undefined = await headObject(user, User);
```

Load the metadata for an object at a specific version, or get undefined if nothing is found.

```
import { getObject } from '@mu-ts/s3';

const versionId: string = '...';
const metadata: Record<string, string> | undefined = await headObject(user, User, versionId);
```

### existsObject(id, Class, version?)

Get a boolean value for if an object exists. Uses headObject under the covers since its lighter weight than loading the whole object.

```
import { headObject } from '@mu-ts/s3';

const exists: boolean = await existsObject(user, User);
```

Load the metadata for an object at a specific version, or get undefined if nothing is found.

```
import { getObject } from '@mu-ts/s3';

const versionId: string = '...';
const exists: boolean = await existsObject(user, User, versionId);
```

### listObjects(Class, prefix?, size?, continuationToken?)

Return a list of object metadata (key, etag, size, etc) for a bucket.

```
import { listObjects, Objects, ObjectKey } from '@mu-ts/s3';

const pageSize: number = 100;
const results: Objects = await listObjects(User, undefined, pageSize);

/**
 * Continuation tokens are returned so pagination can continue.
 */
const continuationToken: string = results.getContinuationToken();
const results: ObjectKey[] = results.getResults();

const nextResults: Objects = await listObjects(User, undefined, pageSize, continuationToken);

```

## Stream

This is not tested yet, but should work?

```
import { listObjectsStream } from '@mu-ts/s3';

listObjectsStream(User, undefined, false).pipe(system.out);


```
