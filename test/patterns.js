'use strict';

var should = require('should');

module.exports = function(requirem){

  it('should be able to filter', function(){
    should(requirem('./modules/', /(.*)(?=stuff\.js)/).someStuff)
      .be.an.Object
      .and
      .be.eql(require('./modules/some-stuff'));
  });
};
