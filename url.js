//node-thumbor - node.js extension to thumbor
//http://github.com/fabiomcosta/node-thumbor

//Licensed under the MIT license:
//http://www.opensource.org/licenses/mit-license
//Copyright (c) 2011 Fabio Miranda Costa fabiomcosta@gmail.com

var crypto = require('crypto');

function calculateDimensions(urlParts, options) {
    var width = options.width || 0;
    var height = options.height || 0;

    var flip = options.flip;
    var flop = options.flop;

    if (!width && !height) {
        if (flip) {
            width = '-0'
        }
        if (flop) {
            height = '-0'
        }
    } else {
        if (flip){
            width = width * -1;
        }
        if (flop){
            height = height * -1;
        }
    }

    if (width || height) {
        urlParts.push(width + 'x' + height);
    }
}

exports.urlFor = function(options){
    if (!options.imageUrl) {
        throw 'The imageUrl argument is mandatory.';
    }

    var urlParts = [];

    if (options.meta) {
        urlParts.push('meta');
    }

    if (options.crop) {
        var cropLeft = options.crop[0],
            cropTop = options.crop[1],
            cropRight = options.crop[2],
            cropBottom = options.crop[3];

        if (cropLeft || cropTop || cropRight || cropBottom) {
            urlParts.push(cropLeft + 'x' + cropTop + ':' + cropRight + 'x' + cropBottom);
        }
    }

    calculateDimensions(urlParts, options);

    if (options.halign && options.halign != 'center'){
        urlParts.push(options.halign);
    }

    if (options.valign && options.valign != 'middle'){
        urlParts.push(options.valign);
    }

    if (options.smart) {
        urlParts.push('smart');
    }

    var imageHash = crypto.createHash('md5').update(options.imageUrl).digest('hex');
    urlParts.push(imageHash);

    return urlParts.join('/');
}
