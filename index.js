'use strict';

var fs = require('fs');
var path = require('path');
var type = require('utils-type');
var camelcase = require('camelcase');
var callersPath = require('callers-path');


function requirem(pathName, _opts){
  var error, opts = type(_opts || pathName).plainObject || { };
  opts.pathName = (type(pathName).string || '').replace(/^\./, function(){
      opts.origin = type(opts.origin).function || requirem;
      opts.dirName = type(opts.dirName || _opts).string || '';
      return path.dirname( path.join(callersPath(opts.origin), opts.dirName) );
    });

  var camelName, fileExports = { };
  try {
    opts.dirls = type(opts.dirls).array || fs.readdirSync(opts.pathName);
    // opts.pathName was a directory
    opts.pattern = type(opts.pattern || _opts || pathName).regexp || /\.(js)$/i;
    opts.dirls.forEach(function (fileName){
      if( !opts.pattern.test(fileName) ){ return ; }
      fileName = path.resolve(opts.pathName, fileName);
      camelName = camelcase(path.basename(fileName, path.extname(fileName)));
      // camelcase'em & is no need for fileExports['some-key']
      if( opts.reload ){ delete require.cache[fileName]; }
      fileExports[camelName] = require(fileName);
    });
    error = null; // wipe
    return fileExports;
  } catch(err){ error = err; } // it also can be a module
  //
  // opts.pathName should be a module
  //     <^> that is... file
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
}
module.exports = requirem;
