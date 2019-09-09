/**!
 * lib/index.js -- SCR Implementation
 *
 * Copyright (c) 2015 Cisco Systems, Inc. See LICENSE file.
 */
 "use strict";

var clone = require("lodash.clone"),
    jose = require("node-jose");

function SCRObject(cfg) {
  cfg.loc = cfg.loc || undefined;
  cfg.tag = cfg.tag || undefined;

  Object.defineProperty(this, "enc", {
    get: function() {
      return cfg.enc;
    },
    enumerable: true
  });
  Object.defineProperty(this, "key", {
    get: function() {
      return cfg.key;
    },
    enumerable: true
  });
  Object.defineProperty(this, "iv", {
    get: function() {
      return cfg.iv;
    },
    enumerable: true
  });
  Object.defineProperty(this, "aad", {
    get: function() {
      return cfg.aad;
    },
    enumerable: true
  });
  Object.defineProperty(this, "loc", {
    get: function() {
      return cfg.loc;
    },
    set: function(loc) {
      cfg.loc = loc;
    },
    enumerable: true
  });
  Object.defineProperty(this, "tag", {
    get: function() {
      return cfg.tag;
    },
    enumerable: true
  });

  Object.defineProperty(this, "toJSON", {
    value: function() {
      var key = cfg.key.get("k", true);
      var data = {};
      data.enc = cfg.enc;
      data.key = jose.util.base64url.encode(key);
      data.iv = jose.util.base64url.encode(cfg.iv);
      data.aad = cfg.aad;

      if (cfg.loc) {
        data.loc = cfg.loc;
      }
      if (cfg.tag) {
        data.tag = jose.util.base64url.encode(cfg.tag);
      }

      return data;
    }
  });
  Object.defineProperty(this, "toJWE", {
    value: function(jwk) {
      var self = this,
          promise;
      promise = jose.JWK.asKey(jwk);
      promise = promise.then(function(jwk) {
        var rcpt = {
          header: {
            alg: "dir"
          },
          key: jwk,
          reference: false
        };
        var opts = {
          compact: true,
          contentAlg: cfg.enc
        };

        var data = self.toJSON();
        data = JSON.stringify(data);
        return jose.JWE.createEncrypt(opts, rcpt).
               final(data, "utf8");
      });

      return promise;
    }
  });

  Object.defineProperty(this, "encrypt", {
    value: function(pdata) {
      var props = {
        iv: cfg.iv,
        adata: new Buffer(cfg.aad, "utf8")
      };

      // condition the data before encrypting
      pdata = jose.util.asBuffer(pdata);
      return cfg.key.encrypt(cfg.enc, pdata, props).
             then(function(result) {
                var cdata = result.data;
                cfg.tag = result.tag;

                return cdata;
             });
    }
  });
  Object.defineProperty(this, "decrypt", {
    value: function(cdata) {
        var props = {
          iv: cfg.iv,
          adata: new Buffer(cfg.aad, "utf8"),
          mac: cfg.tag
        };

        // condition data before decrypting
        cdata = jose.util.asBuffer(cdata);
        return cfg.key.decrypt(cfg.enc, cdata, props).
               then(function(pdata) {
                  return pdata;
               });
    }
  });
}

var SCR = {
  create: function() {
    // TODO: make this more configurable
    // TODO: abstract away forge??
    var iv = jose.util.randomBytes(12);
    var aad = new Date().toISOString();

    var keystore = jose.JWK.createKeyStore();
    var promise = keystore.generate("oct", 256);
    promise = promise.then(function(key) {
      return new SCRObject({
        enc: "A256GCM",
        key: key,
        iv: iv,
        aad: aad
      });
    });

    return promise;
  },
  fromJWE: function(jwk, jwe) {
    var promise;
    promise = jose.JWK.asKey(jwk);
    promise = promise.then(function(jwk) {
      return jose.JWE.createDecrypt(jwk).decrypt(jwe);
    });
    promise = promise.then(function(result) {
      result = result.plaintext.toString("utf8");
      result = JSON.parse(result);
      return SCR.fromJSON(result);
    });

    return promise;
  },
  fromJSON: function(json) {
    // create a copy to mitigate tampering
    var cfg = clone(json);

    var promise;
    if (json.key) {
      promise = jose.JWK.asKey({
        kty: "oct",
        k: json.key
      });
    } else {
      promise = Promise.resolve();
    }
    promise = promise.then(function(key) {
      if (key) {
        cfg.key = key;
      }

      if ("iv" in cfg) {
        cfg.iv = Buffer.isBuffer(cfg.iv) ?
                 cfg.iv :
                 jose.util.base64url.decode(cfg.iv);
      }
      if ("tag" in cfg) {
        cfg.tag = Buffer.isBuffer(cfg.tag) ?
                  cfg.tag :
                  jose.util.base64url.decode(cfg.tag);
      }

      return new SCRObject(cfg);
    });

    return promise;
  }
};

module.exports = SCR;
