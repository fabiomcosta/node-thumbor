var vows = require('vows'),
    assert = require('assert'),
    crypto = require('crypto');

var thumbor = require('../thumbor');

var key = 'salt-key';
<D-‘>
vows.describe('Thumbor url generator').addBatch({
    'instance': {
        topic: function(){
            return new thumbor.CryptoUrl({key: key});
        },
        'can create an instance': function(topic){
            assert.ok(topic != null);
        },
        'keeps key as an instance value': function(topic){
            assert.ok(topic._key != null);
            assert.notEqual(topic._key, key);
            assert.length(topic._key, 24);
        }
    },
    'usage': {
        topic: function(){
            var cryptoUrl = new thumbor.CryptoUrl({key: key});
            cryptoUrl.width(200).height(300).imageUrl('something.jpg');
            cryptoUrl.generate(this.callback);
        },
        'get url': function(error, topic){
            assert.ok(topic);
            assert.equal(topic, '/VoGkksTSw6Dt9koSRWBdniQiFBmOA_Bx9bq7BcTH3-yo6qFAB_zX0YrdfeejT5_d/something.jpg');
        }
    }
}).export(module);
