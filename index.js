'use strict';

var fs = require('fs');
var path = require('path');
var type = require('utils-type');
var camelcase = require('camelcase');
var callersPath = require('callers-path');

function requirem(pathName, _opts){
  var dirError = null, choose = _opts || pathName;
  var opts = type(choose).plainObject || { };
  opts.pathName = (type(pathName).string || '').replace(/^\./, function(){
      opts.dirName = type(opts.dirName).string || '';
      opts.origin = type(opts.origin || choose).function || requirem;
      return path.dirname( path.join(callersPath(opts.origin), opts.dirName) );
    });

  var camelName, fileExports = { };
  try {
    opts.dirls = type(opts.dirls || choose).array || fs.readdirSync(opts.pathName);
    // opts.pathName was a directory
    opts.pattern = type(opts.pattern || choose).regexp || /\.(js)$/i;
    opts.dirls.forEach(function (fileName){
      if( !opts.pattern.test(fileName) ){ return ; }
      fileName = path.join(opts.pathName, fileName);
      camelName = camelcase(path.basename(fileName, path.extname(fileName)));
      // camelcase'em & is no need for fileExports['some-key']
      if( opts.reload ){ delete require.cache[fileName]; }
      fileExports[camelName] = require(fileName);
    });
    opts = dirError = null; // wipe
    return fileExports;
  } catch(err){ dirError = err; } // it also can be a module
  //
  // opts.pathName module or it doesn't exists
  // <^> that is... file
  try {
    opts.pathName = require.resolve(opts.pathName);
    opts.loaded = !opts.reload || delete require.cache[opts.pathName];
    return require(opts.pathName);
  } catch(requireError) {
    // we are throwing here anyway
    fs.exists(opts.pathName, function(exists){
      if( exists ){ throw requireError; }
      else        { throw dirError; }
    });
  }
}
module.exports = requirem;
