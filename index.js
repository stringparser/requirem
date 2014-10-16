'use strict';

var fs = require('fs');
var path = require('path');
var type = require('utils-type');
var camelcase = require('camelcase');
var callersPath = require('callers-path');

function requirem(pathName, _opts){
  var fileExports = { };
  var requireError = null;
  var choose = _opts || pathName;
  var opts = type(choose).plainObject || { };

  opts.pathName = (type(opts.pathName || pathName).string || ' ')
    .replace(/^\.|^[ ]$/, function(){
      opts.dirName = type(opts.dirName).string || '.';
      opts.origin = type(opts.origin || choose).function || requirem;
      return path.dirname( path.resolve(callersPath(opts.origin), opts.dirName) );
    });
  //
  // isModule?
  // <^> that is... file
  try {
    opts.pathName = require.resolve(opts.pathName);
    if(opts.reload){ delete require.cache[opts.pathName]; }
    fileExports = require(opts.pathName);
    require.cache[opts.pathName].exports = fileExports;
    opts = requireError = null; // wipe
    return fileExports;
  } catch(err) { requireError = err; }
  //
  // not throwing yet, can be a directory
  //
  try {
    opts.dirls = type(opts.dirls || choose).array || fs.readdirSync(opts.pathName);
    // opts.pathName was a directory
    opts.pattern = type(opts.pattern || choose).regexp || /\.(js)$/i;
    opts.dirls.forEach(function (fileName){
      if( !opts.pattern.test(fileName) ){ return ; }
      fileName = path.join(opts.pathName, fileName);
      var camelName = camelcase(path.basename(fileName, path.extname(fileName)));
      // camelcase'em & is no need for fileExports['some-key']
      if(opts.reload){ delete require.cache[fileName]; }
      fileExports[camelName] = require(fileName);
      require.cache[fileName].exports = fileExports[camelName];
    });
    opts = requireError = null; // wipe
    return fileExports;
  } catch(dirnameError){
    // we are throwing here anyway
    fs.exists(opts.pathName, function(exists){
      if( exists ){ throw dirnameError; }
      else        { throw requireError; }
    });
  }
}
module.exports = requirem;
