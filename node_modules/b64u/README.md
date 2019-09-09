# ⚡ b64u

[![Build Status](https://img.shields.io/travis/jacobwgillespie/b64u/master.svg)](https://travis-ci.org/jacobwgillespie/b64u)
[![npm](https://img.shields.io/npm/v/b64u.svg)](https://www.npmjs.com/package/b64u)
[![npm](https://img.shields.io/npm/dm/b64u.svg)](https://www.npmjs.com/package/b64u)
[![license](https://img.shields.io/github/license/jacobwgillespie/b64u.svg)](https://github.com/jacobwgillespie/b64u/blob/master/LICENSE)
[![Powered by TypeScript](https://img.shields.io/badge/powered%20by-typescript-blue.svg)](https://www.typescriptlang.org/)

A tiny, lightweight module for encoding and decoding Base64 URLs ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5)). Supports TypeScript, but also works without it.

**NOTE:** if you were previously using the unmaintained `base64url` package, this library is API-identical.

## Requirements

* NodeJS v4+

## Installation

Install via yarn:

```
yarn add b64u
```

Or via NPM:

```
npm install --save b64u
```

## Example

```typescript
import b64u from 'b64u'

b64u('A tiny, lightweight module')
// 'QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU'

b64u.encode('A tiny, lightweight module')
// 'QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU'

b64u.decode('Zm9yIGVuY29kaW5nIGFuZCBkZWNvZGluZyBCYXNlNjQgVVJMcw')
// 'for encoding and decoding Base64 URLs'

b64u.toBase64('QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU')
// 'QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU='

b64u.fromBase64('QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU=')
// 'QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU'

b64u.toBuffer(b64u('tiny'))
// <Buffer 74 69 6e 79>
```

## Usage

Either require or import the library:

```javascript
const b64u = require('b64u')
```

```typescript
import b64u from 'b64u'
```

### API

#### b64u(input: string | Buffer, encoding = 'utf8'): string

#### b64u.encode(input: string | Buffer, encoding = 'utf8'): string

Encodes an `input` string or buffer into a Base64 URL. Optionally specify an `encoding`.

**Example**

```typescript
b64u('A tiny, lightweight module')
// 'QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU'

b64u.encode('A tiny, lightweight module')
// 'QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU'
```

#### b64u.decode(input: string | Buffer, encoding = 'utf8'): string

Decodes an `input` Base64 URL into a raw string. Optionally specify an `encoding`.

**Example**

```typescript
b64u.decode('Zm9yIGVuY29kaW5nIGFuZCBkZWNvZGluZyBCYXNlNjQgVVJMcw')
// 'for encoding and decoding Base64 URLs'
```

#### b64u.toBase64(input: string): string

Converts an `input` Base64 URL into a plain Base64 string.

**Example**

```typescript
b64u.toBase64('QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU')
// 'QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU='
```

#### b64u.fromBase64(input: string): string

Converts an `input` plain Base64 string into a Base64 URL.

**Example**

```typescript
b64u.fromBase64('QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU=')
// 'QSB0aW55LCBsaWdodHdlaWdodCBtb2R1bGU'
```

#### b64u.toBuffer(input: string): Buffer

Converts an `input` Base64 URL into a Buffer with the raw bytes.

**Example**

```typescript
b64u.toBuffer(b64u('tiny'))
// <Buffer 74 69 6e 79>
```

## Background

This library began as an API-identical fork of the [`base64url` package](https://github.com/brianloveswords/base64url), as that package has not been updated since 2016 and currently suffers from [a critical issue](https://github.com/brianloveswords/base64url/issues/13) that prevents its use with TypeScript and any version of NodeJS other than Node 6.0.0.

Why the name, `b64u`? It's a tiny, lightweight name for a tiny, lightweight module!

## License

The MIT license. See `LICENSE`.

Copyright (c) 2018 Jacob Gillespie

Copyright (c) 2013–2016 Brian J. Brennan
