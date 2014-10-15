'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');
var camelcase = require('camelcase');

module.exports = function(requirem){

  it('should get directories', function(){
    var testModules = requirem('./modules');
    should(testModules).be.an.Object
      .and
      .not.have.properties(
        fs.readdirSync('./test/modules').map(function(fileName){
          return camelcase(path.basename(fileName, path.extname(fileName)));
        })
      );
  });
};
