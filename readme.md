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
var myProject = requirem(); // equivalent to require('./.') form any dir

// can reload
var watcher = require('gaze').Gaze('./lib/*.js');
gaze.on('all', function(event, filepath){
  ev.delete || requirem(filepath, { reload : true })
})

// exports are camelkeyed
var fileExports = require('./lib/utils');
// {
//   routeUserAdmin : [function isAdmin] file was "route-user-admin.js"
//   routeUserSomething : [function]     file was "route.user.something.js"
// }

// can use a regex to filter files so you can fattern directories
var fileExports = require('./lib/utils', { pattern : './route-user-(.*)\.js'});
// {
//   routeUserAdmin : [function isAdmin]
//   ...
// }

```

## install

    $ npm install --save requirem

### test

    $ npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/requirem.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
