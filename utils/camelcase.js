'use strict';
module.exports = function (str) {
  str = str.trim();

  if (str.length === 1) {
    return str;
  }

  return str
  .replace(/^[_.\- ]+/, '')
    .replace(/(\w+)(?=[_.\- ]+)/, function(m, p1){
      return p1.toLowerCase();
    }).replace(/[_.\- ]+(\w+|$)/g, function (m, p1) {
      return (
        p1.substring(0,1).toUpperCase() +
        p1.substring(1).toLowerCase()
      );
    });
};
