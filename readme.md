# requirem [<img alt="progressed.io" src="http://progressed.io/bar/80" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/requirem/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/requirem/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/requirem.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/requirem)
<br><br>
<p align="center">Tiny, require 'em things with knobs.</p>
<p align="center">
  <a hef="https://github.com/503.html">
    <img height="200" src="https://raw.githubusercontent.com/stringparser/requirem/master/gh-503-unicorn.png" />
  </a>
</p>
<p align="center">
  <a href="https://github.com/503.html">Unicorn approval</a> pending.
</p>


### usage

```js
var requirem = require('requirem');

// works with no arguments,
var myProject = requirem(); 
// equivalent to require('./.') from any dir

// for directories,
var dirExports = requirem('./folder');
var dirExports = requirem('./folder/subfolder');

// and modules
var util = requirem('./lib/utils');
// if ./lib/utils is a module 
// it will be required as so even if it was a directory

// exports are camelkeyed
var dirExports = requirem('./routes'); 
// ./routes was a directory but not a module
// {
//       userAdmin : [Function]  file was "user-admin.js"
//   userSomething : [Function]  file was "user.something.js"
// }

// filters via regexp
var headerExports = requirem(/header-(.*)\.js/);
var headerExports = requirem('./partial', /header-(.*)\.js/);
// {
//   headerHome : [Function]
//   headerSomething : [Function]
// }

// reload option cleans the require.cache
var gaze = new requirem('gaze').Gaze('./lib/*.js');
gaze.on('all', function(ev, filepath){
  ev.delete || requirem(filepath, { reload : true })
});
```

~ 50 SLOC

## install

    $ npm install --save requirem

### test

    $ npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/requirem.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
