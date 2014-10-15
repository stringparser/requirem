'use strict';

var fs = require('fs');
var path = require('path');
var type = require('utils-type');
var camelcase = require('camelcase');
var callersPath = require('callers-path');

function requirem(dirname, pathName, opts){

  opts = type(opts).plainObject || { };
  dirname = type(dirname).string || path.dirname(callersPath(requirem));
  // ^ if no directory given go find it

  // parse arguments
  var parsed = type(pathName).string
    ? path.resolve(dirname, path.basename(pathName))
    : dirname;

  // module?
  // single file or something that resolves to one
  var resolveError = null;
  try {
    parsed = require.resolve(parsed);
    if( opts.reload ){ delete require.cache[parsed]; }
    return require(parsed);
  } catch(err) { resolveError = err; }

  // plain directories left
  var dirError = null, dirls = null;
  try { dirls = fs.readdirSync(parsed); }
    catch(err){ dirError = err; }
  if( dirError && dirError.code === 'ENOENT' ){ throw resolveError || dirError; }

  // the path resolved is a directory and exists
  dirname = parsed;
  var errors = null;
  var name, fileExports = null;
  var pattern = type(opts.pattern).regexp || /\.(js)$/i;
  dirls = dirls.filter(function (fileName){
    if( !pattern.test(fileName) ){ return ; }
    parsed = path.resolve(dirname, fileName);
    name = camelcase(path.basename(fileName, path.extname(fileName)));
    // ^ camelcased so there is no need for ['key']
    if( opts.reload ){ delete require.cache[parsed]; }
    fileExports = fileExports || { };
    try { fileExports[name] = require(parsed); }
      catch(err){ errors = errors || [ ]; errors.push(err); }
    return true;
  });
  if( errors[0] ){
    console.log(errors.map(function(err){ return err.stack; }).join('\n'));
    if( errors[1] ){ throw errors.slice(0,-1)[0]; }
  }
  return (
    dirls.length === 1
      ? fileExports[name]
      : fileExports || { }
  );
}
module.exports = requirem;
