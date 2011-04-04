var crypto = require('crypto');
var exec = require('child_process').exec;

var CryptoUrl = exports.CryptoUrl = function(options){
    this.setOptions(options);
}

var prototype = {
    setOptions: function(options){
        for (opt in options){
            this[opt](options[opt]);
        }
    },
    set: function(name, value){
        this['_'+name] = value;
        return this;
    },
    get: function(name){
        return this['_'+name];
    },
    setOrGet: function(name, value){
        if (value == null){
            return this.get(name);
        } else {
            return this.set(name, value);
        }
    },
    keyLength: 24,
    key: function(value){
        if (value == null){
            return this.get('key');
        }
        while (value.length < this.keyLength){
            value += value;
        }
        //this.cipher = crypto.createCipher('des3', value);
        return this.set('key', value.slice(0, this.keyLength));
    },
    _pad: function(){

    },
    generate: function(callback){
        if (!this.imageUrl()){
            throw new Error("The image cannot be null or empty.");
        }
        if ((/^\//).test(this.imageUrl())){
            this.imageUrl(this.imageUrl().slice(1));
        }

        var urlParts = [];

        if (this.meta()){
            urlParts.push('meta');
        }

        var crop = this.cropLeft() || this.cropTop() || this.cropRight() || this.cropBottom();
        if (crop){
            urlParts.push(this.cropLeft() +'x'+ this.cropTop() +':'+ this.cropRight() +'x'+ this.cropBottom());
        }
        if (this.width() && this.height()){
            urlParts.push(this.width() + 'x' + this.height());
        } else if (this.width()){
            urlParts.push(this.width() + 'x0');
        } else if (this.height()){
            urlParts.push('0x' + this.height());
        }

        if (this.halign() && this.halign() != 'center'){
            urlParts.push(this.halign());
        }
        if (this.valign() && this.valign() != 'middle'){
            urlParts.push(this.valign());
        }
        if (this.smart()){
            urlParts.push('smart');
        }

        var imageHash = crypto.createHash('md5').update(this.imageUrl()).digest('hex');
        urlParts.push(imageHash);

        var url = urlParts.join('/');
    
        var command = [
            "import base64",
            "import sys",
            "from Crypto.Cipher import *",
            "pad = lambda s: s + (16 - len(s) % 16) * '{'",
            "cypher = AES.new('"+ this.key() +"')",
            "sys.stdout.write(base64.urlsafe_b64encode(cypher.encrypt(pad('"+ url +"'))))"
        ];
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
