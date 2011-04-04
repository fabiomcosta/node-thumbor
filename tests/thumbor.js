var vows = require('vows'),
    assert = require('assert'),
    crypto = require('crypto');

var thumbor = require('../thumbor');

var key = 'my-security-key';

vows.describe('Thumbor url generator').addBatch({
    'instance': {
        topic: function(){
            return new thumbor.CryptoUrl({key: key});
        },
        'can create an instance': function(topic){
            assert.ok(topic != null);
        },
        'keeps key as an instance value': function(topic){
            assert.ok(topic.properties.key != null);
            assert.notEqual(topic.properties.key, key);
            assert.length(topic.properties.key, 16);
        }
    },
    'build url': {
        topic: function(){
            var cryptoUrl = new thumbor.CryptoUrl({key: key});
            cryptoUrl.width(300).height(200).imageUrl('my.server.com/some/path/to/image.jpg');
            return cryptoUrl.buildUrl();
        },
        'checks the built url': function(topic){
            assert.equal(topic, '300x200/84996242f65a4d864aceb125e1c4c5ba');
        }
    },
    'usage': {
        topic: function(){
            var cryptoUrl = new thumbor.CryptoUrl({key: key});
            cryptoUrl.width(300).height(200).imageUrl('my.server.com/some/path/to/image.jpg');
            cryptoUrl.generate(this.callback);
        },
        'get url': function(error, topic){
            assert.ok(topic);
            assert.equal(topic, '/l42l54VqaV_J-EcB5quNMP6CnsN9BX7htrh-QbPuDv0C7adUXX7LTo6DHm_woJtZ/my.server.com/some/path/to/image.jpg');
        }
    }
}).export(module);
