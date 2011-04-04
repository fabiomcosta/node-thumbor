var crypto = require('crypto');
var exec = require('child_process').exec;
var url = require('./url');

var CryptoUrl = exports.CryptoUrl = function(options){
    this.properties = {};
    this.setOptions(options);
}

var prototype = {
    setOptions: function(options){
        for (opt in options){
            this[opt](options[opt]);
        }
    },
    set: function(name, value){
        this.properties[name] = value;
        return this;
    },
    get: function(name){
        return this.properties[name];
    },
    setOrGet: function(name, value){
        if (value == null){
            return this.get(name);
        } else {
            return this.set(name, value);
        }
    },
    keyLength: 16,
    key: function(value){
        if (value == null){
            return this.get('key');
        }
        while (value.length < this.keyLength){
            value += value;
        }
        return this.set('key', value.slice(0, this.keyLength));
    },
    _padKey: function(key){
        var diff = key.length % this.keyLength;
        for (var i = diff; i--;){
            key += '{';
        }
        return key;
    },
    buildUrl: function(){
        return url.urlFor(this.properties);
    },
    generate: function(callback){
        var url = this.buildUrl();

        var command = [
            "import base64",
            "import sys",
            "from Crypto.Cipher import *",
            "cypher = AES.new('"+ this.key() +"')",
            "sys.stdout.write(base64.urlsafe_b64encode(cypher.encrypt('"+ this._padKey(url) +"')))"
        ];

        //var cipher = crypto.createCipher('aes-128-ecb', this.key());
        //var enc = cipher.update(this._padKey(url), 'binary', 'base64');

        exec('python -c "' + command.join(';') + '"', function(error, stdout, stderr){
            callback.call(this, error, '/' + stdout.trim() + '/' + this.imageUrl());
        }.bind(this));
    }
};

for (method in prototype){
    CryptoUrl.prototype[method] = prototype[method];
}

var methods = [
    'key',
    'width',
    'height',
    'smart',
    'meta',
    'flipHorizontal',
    'flipVertical',
    'halign',
    'valign',
    'cropLeft',
    'cropTop',
    'cropRight',
    'cropBottom',
    'imageUrl'
];

var createMethod = function(method){
    return function(value){
        return this.setOrGet(method, value);
    };
}

for (var i = methods.length; i--;){
    var method = methods[i];
    if (!CryptoUrl.prototype[method]){
        CryptoUrl.prototype[method] = createMethod(method);
    }
}
