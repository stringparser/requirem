'use strict';
module.exports = function (str) {
  str = str.trim();

  if (str.length === 1) {
    return str;
  }

  return str
  .replace(/^[_.\- ]+/, '')
    .replace(/(\w+)(?=[_.\- ]+)|(\w+)(?=[A-Z])/, function(m, p1, p2){
      return (p2 || p1).toLowerCase();
    }).replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
      return p1.toUpperCase();
    });
};
