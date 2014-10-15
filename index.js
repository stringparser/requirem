'use strict';

var fs = require('fs');
var path = require('path');
var type = require('utils-type');
var camelcase = require('camelcase');
var callersPath = require('callers-path');


function requirem(pathName, _opts){
  var error, opts = type(_opts || pathName).plainObject || { };
  opts.origin = type(opts.origin).function || requirem;
  opts.pattern = type(opts.pattern || _opts || pathName).regexp || /\.(js)$/i;
  opts.pathName = (type(pathName).string || '').replace(/^\./, function(){
      return path.dirname(callersPath(opts.origin));
    });

  var fileExports = { };
  try {
    opts.dirls = type(opts.dirls).array || fs.readdirSync(opts.pathName);
    // opts.pathName was a directory
    opts.dirls.forEach(function (fileName){
      if( !opts.pattern.test(fileName) ){ return ; }
      fileName = path.resolve(opts.pathName, fileName);
      var name = camelcase(path.basename(fileName, path.extname(fileName)));
      // camelcase'em & is no need for fileExports['some-key']
      if( opts.reload ){ delete require.cache[fileName]; }
      fileExports[name] = require(fileName);
    });
    opts = error = null; // wipe
    return fileExports;
  } catch(err){ error = err; }
  //
  // opts.pathName should be a module
  // <^> meaning: file
  try {
    opts.pathName = require.resolve(opts.pathName);
    opts.loaded = !opts.reload || delete require.cache[opts.pathName];
    return require(opts.pathName);
  } catch(err) {
     fs.exists(opts.pathName, function(exists){
       if( exists ){ throw error; }
       else { throw err; }
     });
  }
  // directory?
}
module.exports = requirem;
