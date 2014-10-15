'use strict';

var fs = require('fs');
var path = require('path');
var type = require('utils-type');
var camelcase = require('camelcase');
var callersPath = require('callers-path');

function requirem(dirname, pathName, opts){

  opts = type(opts).plainObject || { };
  dirname = type(dirname).string || path.dirname(callersPath(requirem));
  // resolved path
  var resolved = type(pathName).string
    ? path.resolve(dirname, path.basename(pathName))
    : dirname;

  // module?
  var error = null;
  try { resolved = require.resolve(resolved); }
  catch(err) { error = err; }
  if( !error ){
    if( opts.reload ){ delete require.cache[resolved]; }
    return require(resolved);
  }

  // plain directories left
  var dirls = null;
  try { dirls = fs.readdirSync(resolved); }
  catch(err){ error = err; }
  if( error && error.code === 'ENOENT' ){ throw error; }

  // the path resolved is a directory and exists
  dirname = resolved;
  var name, fileExports = null;
  var extension = type(opts.extension).regexp || /(\.(js)$)/i;
  dirls.forEach(function (fileName){
    if( !extension.test(fileName) ){ return ; }
    name = path.basename(fileName, path.extname(fileName));
    resolved = path.resolve(dirname, fileName);
    if( opts.reload ){ delete require.cache[resolved]; }
    fileExports = fileExports || { };
    fileExports[ camelcase(name) ] = require(resolved);
  });
  return fileExports || { };
}
module.exports = requirem;
