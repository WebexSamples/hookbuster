# node-scr #

A JavaScript implementation of Secure Content Resource (SCR) for current web browsers and node.js-based servers.  An SCR provides enough information to find and decrypt large protected content (e.g., shared file).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<a name='toc'>

- [Installing](#installing)
- [Basics](#basics)
- [Creating](#creating)
- [Dealing with Content](#dealing-with-content)
- [Importing/Exporting as a JWE](#importingexporting-as-a-jwe)
- [As JSON](#as-json)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing ##

To install the latest from [NPM](https://npmjs.com/):

```
  npm install node-scr
```

Or to install a specific release:

```
  npm install node-scr@0.2.0
```

Alternatively, the latest unpublished code can be installed directly from the repository:

```
  npm install git+ssh://git@github.com:cisco/node-scr.git
```

## Basics ##

Require the library as normal:

```
var SCR = require("node-scr");
```

This library uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for most operations.

This library supports [Browserify](http://browserify.org/).  To use in a web browser, `require('node-scr')` and bundle with the rest of your app.

The content to be encrypted or returned from being decrypted are [Buffer](https://nodejs.org/api/buffer.html) objects.

## Creating ##

To create an empty SCR:

```
var scrObject;
SCR.create().
    then(function(result) {
      // {result} is a SRC object
      scrObject = result;
    });
```

The SCR object has the following properties:

* "enc" - The Content Encryption Algorithm (from [JWA](https://tools.ietf.org/html/rfc7518))
* "key" - The raw content encryption key (as a 'node-jose' jose.JWK.Key object)
* "iv" - The initialization vector (as a Buffer)
* "aad" - The additional authenticated data (as a String)
* "loc" - The location (usually a URI) where the encrypted content is published
* "tag" - The authentication tag (as a Buffer)

`SCR.create()` populates the cryptographic input factors (key, IV, additional authentication data).

The "loc" member is set by the API user, and the "tag" member is set by `scrObject.encrypt()`.


## Dealing with Content

To encrypt content:

```
// {input} is one of:
// -  a node.js Buffer
// -  an ArrayBuffer
// -  a TypedArray
scrObject.encrypt(input).
    then(function(output) {
      // {output} is *just* the encrypted content, as a Buffer
      // "tag" member of {scrObject} is populated with authentication tag
      ....
    });
```

The result from `encrypt()`'s resolved Promise can be passed directly to a WebSocket, XMLHttpRequest, or other processor.

To decrypt content:

```
// *NOTE:* {scrObject} has the correct "tag" for the (encrypted) content
scrObject.decrypt(output).
    then(function(input) {
      // {input} is the decrypted content, as a Buffer
      ....
    });
```

## Importing/Exporting as a JWE ##

Encrypted JWEs are appropriate to be shared with recipients.

To export the SCR as a JWE:

```
var jwe;
// {key} is a JWK from 'node-jose', or the JSON representation of a JWK
scrObject.toJWE(key).
    then(function(result) {
      // {result} is a string representing the JWE using the Compact Serialization
      jwe = result;
    });
```

To import the SCR from a JWE:

```
var scrObject;
// {key} is a JWK from 'node-jose', or the JSON representation of a JWK
// {jwe} is a JWE using any of the serializations (Compact, JSON Flattened, JSON General)
SCR.fromJWE(key, jwe).
    then(function(result) {
      // {result} is a SCR object
      scrObject = result;
    });
```

## As JSON ##

**NOTE:** The JSON representation **SHOULD NOT** be shared outside of running code.  It contains all the information necessary to decrypt content

An SCR has the following members (presented as [JCR](https://tools.ietf.org/html/draft-newton-json-content-rules)):

```
scr {
  "enc" : string,   ; Content Encryption Algorithm from [RFC7518]
  "key" : string,   ; base64url-encoded raw key value
  "iv"  : string,   ; base64url-encoded initialization vector
  "aad" : string,   ; Additional authenticated data (AAD)
  "loc" : ? uri,    ; Location of encrypted content
  "tag" : ? string  ; base64url-encoded authentication tag
}
```

The "loc" and "tag" members are optional:

* "loc" is set by the API user (usually after the encrypted content is published; e.g., uploaded to a sharing service)
* "tag" is set by `scrObject.encrypt()`

A complete example of an SCR as JSON:

```
{
  "enc": "A256GCM",
  "key": "Ce3pe4stGd3tvZdSR3ekIoNjF3Q3V6R0oMN4SSGKbyI",
  "iv": "AeU_KNtJ8dbl9k1N",
  "aad": "2015-08-14T17:03:35.504Z",
  "loc": "https://fireshare.example/files/db2daa25-cf41-492b-bc7b-90436949b17c",
  "tag": "ZaRZ5vh1u7lyulUrvTKUDw"
}
```

To export an SCR to a JSON object:

```
var output = scrObject.toJSON();
```

To import an SCR from a JSON object:

```
var scrObject;
// {input} is a JSON representation
SCR.create(input).
    then(function(result) {
      scrObject = result;
    });
```
