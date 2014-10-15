'use strict';

var fs = require('fs');
var path = require('path');
var type = require('utils-type');
var camelcase = require('camelcase');
var callersPath = require('callers-path');

function requirem( dirName, pathName, opts){
  opts = type(opts || pathName).plainObject || type(dirName).plainObject || { };
  dirName = type(dirName).string || path.dirname(callersPath(requirem));
  var parsed = type(pathName).string
    ? path.resolve(dirName, path.basename(pathName))
    : dirName;
  //
  // module?
  // <^> file or something that resolves to one
  var resolveError = null;
  try {
    parsed = require.resolve(parsed);
    if( opts.reload ){ delete require.cache[parsed]; }
    return require(parsed);
  } catch(err) { resolveError = err; }
  //
  // plain directories left
  //
  var dirls = null;
  var dirError = null;
  try { dirls = fs.readdirSync(parsed); }
    catch(err){ dirError = err; }
  if( dirError ){ throw resolveError || dirError; }
  //
  // path is dir and exists
  //
  dirName = parsed;
  var camelName = null, fileExports = { };
  opts.pattern = type(pathName).regexp
    || type(dirName).regexp
    || /\.(js)$/i;

  dirls = dirls.filter(function (fileName){
    if( !opts.pattern.test(fileName) ){ return ; }
    parsed = path.resolve(dirName, fileName);
    camelName = camelcase(path.basename(fileName, path.extname(fileName)));
    //
    // camelcase'em so there is no need for fileExports['some-key']
    if( opts.reload ){ delete require.cache[parsed]; }

    fileExports = fileExports || { };
    try { fileExports[camelName] = require(parsed); }
      catch(err){ throw err; }
    return true;
  });
  return dirls.length < 2 ? fileExports[camelName] : fileExports;
}
module.exports = requirem;
