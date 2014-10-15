# requirem [<img alt="progressed.io" src="http://progressed.io/bar/80" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/requirem/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/requirem/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/requirem.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/requirem)
<br><br>

Tiny require'em with knobs.

<table>
<tr>
<td>Node Version</td>
<td>>= 0.8</td>
</tr>
</table>

### usage

```js
var requirem = require('requirem');

// works with no arguments
var myProject = requirem(); // equivalent to require('./.') from any dir
// {
//   someFile : [Function: someFunction] 
// }

// exports are camelkeyed
var fileExports = requirem('./routes');
// {
//       userAdmin : [Function]  file was "user-admin.js"
//   userSomething : [Function]  file was "user.something.js"
// }

// can requirem sub directories or files
var subDirExports = requirem(__dirname, 'file');
var subDirExports = requirem(__dirname, 'folder/file');

// can filter via regexp
var fileExports = requirem('./partial', /header-(.*)\.js/);
// {
//   headerHome : [Function]
//   headerSomething : [Function]
// }


// can reload
var gaze = new requirem('gaze').Gaze('./lib/*.js')
gaze.on('all', function(ev, filepath){
  ev.delete || requirem(filepath, { reload : true })
});

// If a directory is a module it will NOT 
// be exported as a whole dir but as the module that is

```

~ 50 SLOC

## install

    $ npm install --save requirem

### test

    $ npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/requirem.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
