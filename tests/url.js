var vows = require('vows'),
    assert = require('assert'),
    crypto = require('crypto');

var url = require('../url');

var imageUrl = "my.server.com/some/path/to/image.jpg"
var imageMD5 = "84996242f65a4d864aceb125e1c4c5ba"

vows.describe('url composer').addBatch({
    'image url': {
        'when no options specified': {
            topic: function(){
                return url.urlFor({ imageUrl: imageUrl });
            },
            'get url': function(topic){
                assert.ok(topic);
                assert.equal(topic, imageMD5);
            }
        },
        'when no imageUrl specified': {
            topic: function(){
                try {
                    url.urlFor({});
                } catch(err) {
                    return err;
                }
            },
            'is an error': function(topic) {
                assert.isNotNull(topic);
            },
            'is a message that imageUrl is required': function(topic) {
                assert.equal('The imageUrl argument is mandatory.', topic);
            }
        }
    },
    'dimensions': {
        'when proper width and no height': {
            topic: function(){
                return url.urlFor({
                    imageUrl: imageUrl,
                    width: 300
                });
            },
            'should get 300x0': function(topic){
                assert.equal(topic, '300x0/' + imageMD5);
            }
        },
        'when proper height and no width': {
            topic: function(){
                return url.urlFor({
                    imageUrl: imageUrl,
                    height: 300
                });
            },
            'should get 0x300': function(topic){
                assert.equal(topic, '0x300/' + imageMD5);
            }
        },
        'when proper height and width': {
            topic: function(){
                return url.urlFor({
                    imageUrl: imageUrl,
                    width: 300,
                    height: 200
                });
            },
            'should get 300x200': function(topic){
                assert.equal(topic, '300x200/' + imageMD5);
            }
        },
    },
    'smart': {
        'when smart is true': {
            topic: function(){
                return url.urlFor({
                    imageUrl: imageUrl,
                    width: 200,
                    height: 300,
                    smart: true
                });
            },
            'should get smart': function(topic){
                assert.equal(topic, '200x300/smart/' + imageMD5);
            }
        },
        'when smart and alignment': {
            topic: function(){
                return url.urlFor({
                    imageUrl: imageUrl,
                    smart: true,
                    halign: 'left',
                    valign: 'top'
                });
            },
            'should get smart after alignments': function(topic){
                assert.equal(topic, 'left/top/smart/' + imageMD5);
            }

        }
    },
    'flipping': {
        'when flip and no dimensions': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    flip: true
                });
            },
            'should have -0x0': function(topic){
                assert.equal(topic, '-0x0/' + imageMD5);
            }
        },
        'when flop and no dimensions': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    flop: true
                });
            },
            'should have 0x-0': function(topic){
                assert.equal(topic, '0x-0/' + imageMD5);
            }
        },
        'when flip and flop and no dimensions': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    flip: true,
                    flop: true
                });
            },
            'should have -0x-0': function(topic){
                assert.equal(topic, '-0x-0/' + imageMD5);
            }
        },
        'when flip and width': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    flip: true,
                    width: 200
                });
            },
            'should have -200x0': function(topic){
                assert.equal(topic, '-200x0/' + imageMD5);
            }
        },
        'when flop and height': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    flop: true,
                    height: 300
                });
            },
            'should have 0x-300': function(topic){
                assert.equal(topic, '0x-300/' + imageMD5);
            }
        }
    },
    'alignments': {
         'when halign': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    halign: 'left'
                });
            },
            'should have left url': function(topic){
                assert.equal(topic, 'left/' + imageMD5);
            }
        },
        'when halign is center': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    halign: 'center'
                });
            },
            'should have imageMD5 only': function(topic){
                assert.equal(topic, imageMD5);
            }
        },
        'when valign': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    valign: 'top'
                });
            },
            'should have top url': function(topic){
                assert.equal(topic, 'top/' + imageMD5);
            }
        },
        'when valign is middle': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    valign: 'middle'
                });
            },
            'should have imageMD5 only': function(topic){
                assert.equal(topic, imageMD5);
            }
        },
        'when halign and valign': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    halign: 'left',
                    valign: 'top'
                });
            },
            'should have top url': function(topic){
                assert.equal(topic, 'left/top/' + imageMD5);
            }
        }
    },
    'meta': {
        'when meta flag': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    meta: true
                });
            },
            'should have meta url': function(topic){
                assert.equal(topic, 'meta/' + imageMD5);
            }
        }
    },
    'manual crop': {
        'when proper cropping': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    crop: [10, 20, 30, 40]
                });
            },
            'should have the cropping info': function(topic){
                assert.equal(topic, '10x20:30x40/' + imageMD5);
            }
        },
        'when all crop points are zero': {
            topic: function(){
                 return url.urlFor({
                    imageUrl: imageUrl,
                    crop: [0, 0, 0, 0]
                });
            },
            'should have image md5 only': function(topic){
                assert.equal(topic, imageMD5);
            }
        }

    }
}).export(module);
