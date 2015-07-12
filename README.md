[![NPM Version](http://img.shields.io/npm/v/bundly.svg?style=flat)](https://npmjs.org/package/bundly)
[![Build Status](http://img.shields.io/travis/royriojas/bundly.svg?style=flat)](https://travis-ci.org/royriojas/bundly)

# bundly
`bundly` is a wrapper over watchify and browserify to make it easy to configure common transforms without having to manually do over and over. It also provides a cache option that will help to make incremental builds without having to rely on the `watch` mode for scenarios where a watch mode is not available. It reduces the build time from several seconds to milliseconds, without relying on a watch mode :)

## Motivation
Just wanted to have a good wrapper over browserify/watchify that allow me to make incremental builds even when not using the watch mode.
And have common module with the set of transforms I usually use everyday already preconfigured. This is part also of my efforts to run away from `gulp` and `grunt` and start embracing the `npm as a build tool` idea.

## Demo
Simple usage example: [demo](https://github.com/royriojas/bundly-usage-demo)

## Features of this module
- optional cache mode that will speed up the regular builds (not it watch mode) from several seconds to only milliseconds.
  **DISCLAIMER**: this is done persisting the watchify arguments to disk using the [flat-cache](https://npmjs.org/package/flat-cache) and
  [file-entry-cache](https://npmjs.org/package/file-entry-cache) modules. The best results happen when only a few files were modified. Worse case scenario is when all the files are modified. In average you should experience a very noticeable reduction. As always keep in mind that your mileage may vary.
- Include the following transforms:
  - `consoleify`: to provide a wrapped console over each module
  - `console-filter`: for scenarios where you want to remove all console messages but keep only the ones than match a given regex pattern
  - `shimixify`: a clone of `browserify-shim` but simply for aliasing modules that refer to modules that can be found in the global scope
  - `babelify`: a clone from the original, so we can write shiny ES6 syntax and use JSX syntax for React compo
  - `stricterify`: a stupid transform to add `use strict` to every module. TODO: Check if this should be removed because it
     might not be needed.
  - `lessify`: a clone from the original, to `require` less/css files but fixing an ugly bug when using escaped sequences (like: \u23e)
     that the original module had.
  - `require-arr`: to provide the option to require multiple modules that match a glob pattern like

    ```javascript
    // asumming src folder contains module1.js and module2.js
    var modules = require-arr('./src/**/*.js'); // will replace this by an array of [ require('src/module1.js'), require('src/module2.js')]
    ```

- Add the option to generate the minimized version of the file
- Add the option to add a revision number to the generated **regular** and **min** files.

## Install

```bash
npm i -D bundly
```

## Usage

Here is the output of the --help option:

```
`bundly` is a `watchify`/`browserify` wrapper with some useful preconfigured transforms and cache support
to make it incremental builds even without the watch mode

========================================================
Usage: bundly -c bundly.conf.js
       bundly [options] -o outfile.js entry-file.js
========================================================

Options:
  -u, --use-cache           Whether or not to remember the files and contents and only operate on the changed files to create incremental builds. By default
                            is true - default: true
  -w, --watch               Continuosly watch for changes of the files and do incremental builds
  -m, --minimize            Whether to minimize or not the output or not. By default is `false`. When the flag is set both the non minimified and minified
                            versions will be created
  -o, --output-file String  The path and name for the output file
  -r, --revision String     The revision to use in the generated file names
  -b, --banner String       The banner to put at the top of the compiled files
  -h, --help                Show this help
  -v, --version             Outputs the version number
  -q, --quiet               Show only the summary info
  --colored-output          Use colored output in logs
  -c, --config String       Path to your `bundly` config. This can be used to specify the options instead of passing them on the command line
```

## Examples

```bash
# this will browserify src/foo.js and move it to dist/foo.js
bundly src/foo.js -o dist/foo.js

# same as above but using the cache. First build will take the same amount of time
# as without cache, but next builds using the same flag will be benefited by the cache
# noticeable reducing the building time
bundly -u src/foo.js -o dist/foo.js

# same as above but also will generate the minified version: dist/foo.min.js
bundly -u -m src/foo.js -o dist/foo.js

# same as above, but will generate versioned files like: dist/foo.123.js and dist/foo.123.min.js
bundly -u -m -r 123 src/foo.js -o dist/foo.js

# this will generate dist/foo.js and wait for changes (also using the cache to speed up the build)
bundly -u -w src/foo.js -o dist/foo.js

# this will generate dist/foo.js and wait for changes (also using the cache to speed up the build)
bundly -u -w src/foo.js -o dist/foo.js -b '/* some text to prepend as headers of the files */'
```

**Using the config option**

```javascript
# specify the options in a config file. This has the advantage of receiving the bundle
# object from browserify using the `preBundleCB` which can be specified in the options
# see the bundly.conf.js example below
bundly -c bundly.conf.js
```
Config option:

```javascript
module.exports = function(cli) {
  // cli is an instance of the clix module (https://npmjs.org/package/clix)
  // custom arguments can be pass and will be available in the `cli.opts._` array
  var debug = cli.opts._.indexOf('debug') > -1;
  return {
    src: 'src/target2.js',
    dest: 'dist/target2.js',
    options: {
      shimixify: {
        shims: {
          react: 'global.React'
        }
      },
      preBundleCB: function (b) {
        if (debug){
          console.log('exposing ./src/bar.js as bar');
        }

        b.require('./src/bar.js', {
          expose: 'bar'
        });

        return b;
      }
    }
  };
};
```

**TODO**: Add documentation about the bundled transforms

## NOTES:

- in `watch mode` the minified version won't be generated even if `-m` is specified. It is assumed that watch mode is only used for
  development so no need for the min file
- to destroy the cache and start fresh simply execute the command without the `-u` flag. Cache is only kept if the next run also uses `-u`

## Changelog

[Changelog](./changelog.md)

## License

[MIT](./LICENSE)
