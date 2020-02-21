# s3

Easier interaction with S3.

Carry over from https://github.com/matt-filion/s3-db

# Proposal

Stateless implementation, so less concern about 'collections' and documents focus on simplifying interaction with S3.
Typed exceptions for easier error handling.
Happy defaults to reduce necessary configuration. Including entityt names, just take it from the object.

## Defaults

* REGION = AWS_REGION | REGION | 'us-est-1';
* BUCKET_NAME_PATTERN = 
* RETRIES = 3
* PAGE_SIZE = 100

### APIS

* `S3.configure({ ... })` to configure the S3 singleton defaults, like page size, bucket name or region.
* `S3.conifgurations( @mu-ts/configurations )` to look for configuration values
* `list<T>( prefix? )` to return a list of objects in the type defined.
* `put( document, overwrite=true )` put a document, optionally dont allow overwritting of an existing document. If overwrite is false use `.exists` and if id on doc already exists throw error.
* `modify( id, {changesToApply} )` make sure object exists, load it, apply changes, check eTag/MD5 when saving, if collission, re-try. Continue until re-tries exceeded.
* `get(id, type)` to load a document and have it transformed into the target type.
* `move( document, destination )` moves a document (including origin delete) to the destination bucket.
* `copy( document, destination )` copies a document into the destination bucket.
* `delete( id )` delets a document if it
* `head( id)` returns the head object for the document.
* `exists( id, md5/etag? )` returns true if a head object is found. Wonder if providing etag or md5 as optional secondary attributes will be helpful in making sure the specific content is in place. Maybe supporting object versions as well.
* `s3key( idGenerator? )` annotate a classes id attribute as the object key. Current s3 implementation is bugged with this.
* `@s3bucket( { configuration })` annotate a class to configure it for a specific bucket.
* `@s3prefix( prefix )` annotate a class to have all id operations be prefixed with this value.
* `.safe` hint to prefix calls, that will cause exceptions to be thrown that would otherwise be swallowed like a document not existing. `const user:User = await S3DB.safe.get( 'docID', User )`
* `.retries(4)` attempt the operation the specified number of times until success, and throw the last encountered failure if not. Will analyze the response of the errors returned from S3 and only retry when a retry is permitted.

## Exceptions

* NotFound(bucket, id) - Document doesnt exist.
* ConccurrentModification( bucket, id, eTag, md5) - The document was changed while it was being modified.
  
## Experiments

### Clean get operations.

```
import { get, safe } from '@mu-ts/s3';
const user: User | undefined = get( id );
const user: User = safe.get(id); // Throws error if doesnt exist.
```

### Class decoration.
```
@s3bucket({
  prefix: 'users', // Added before all ids, even when generated.
  bucket: 'postfix or ARN', // If not in ARN prefix, assume its just a postfix and use the default bucket pattern.
  
})
@s3prefix('prefix') //Does it make to have more individual decorators?
class User {
  @s3key( (user:User, uuid:string) => uuid )
  id: string;
  
}
```

### Modify

So apply updates to the stored document, and provide a function to modify the number of attempts (to override defaults.)

```
import { modify, retries } from '@mu-ts/s3';
const update: any = { name: 'tuesday', dayOfWeek: 'Jebidiah' };
const user: User = modify(id, update);

// Multiple Updates to Apply
const update: any = { name: 'tuesday', dayOfWeek: 'Jebidiah' };
const updateTwo: any = { sex:'none', age: 9123 };
const updateFunction: (original:User, updatedUser:User) => { do things };

const user: User = retries(4).modify(id, update, updateTwo, updateFunction);
```

