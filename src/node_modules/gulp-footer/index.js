/* jshint node: true */
'use strict';

var es = require('event-stream');
var template = require('./template');

var footerPlugin = function(footerText, data) {
  footerText = footerText || '';
  return es.map(function(file, cb){
    file.contents = Buffer.concat([
      file.contents,
      new Buffer(template(footerText, Object.assign({file : file}, data)))
    ]);
    cb(null, file);
  });
};

module.exports = footerPlugin;
