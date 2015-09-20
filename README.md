[![NPM Version](http://img.shields.io/npm/v/bundly.svg?style=flat)](https://npmjs.org/package/bundly)
[![Build Status](http://img.shields.io/travis/royriojas/bundly.svg?style=flat)](https://travis-ci.org/royriojas/bundly)

# bundly
`bundly` is a wrapper over watchify and browserify to provide **incremental builds** and make it
easy to configure common transforms without having to manually do it over and over.

## Motivation
I really needed the incremental build part. I know the watch mode (with watchify) is really fast as well, but sometimes when building an app with multiple targets,
compiling each one of them took too much time for my taste. With this module the average time is less than 500ms.

This is part also of my efforts to run away from `gulp` and `grunt` and start embracing the `npm as a build tool` [idea](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/).

**DISCLAIMER**:

**Incremental builds** are possible by persisting to disk the browserify cache used by watchify. This cache is stored inside the [flat-cache](https://www.npmjs.com/package/flat-cache) module in a folder named `.cache`. The [file-entry-cache](https://npmjs.org/package/file-entry-cache) module is used to determine which files changed between different execution of the tools. This information is also persisted in the `.cache` folder of the [flat-cache](https://www.npmjs.com/package/flat-cache) module.

Icremental builds are fast because only perform the processing over the files that changed. If the file didn't change the previous cached result is used.

The best results happen when only a few files were modified. Worse case scenario is when all the files are modified. In average you should experience a very noticeable reduction. **As always keep in mind that your mileage may vary**.

The cache is only kept between executions with the flag `--use-cache, -u` which is true by default. To destroy the cache simply run the tool with the flag `--no-use-cache` or `--use-cache=false` this will destroy the cache. The next execution without this flag will create a new file.

## Demo
Simple usage example: [demo](https://github.com/royriojas/bundly-usage-demo)

## Features of this module

### incremental builds, will speed up the regular builds (not only the ones in `watch` mode) from several seconds to only milliseconds.

```bash
# will create a bundle from entry.js and save it to dist.js
bundly entry.js -o dist.js
```

To destroy the cache

```bash
# will create a bundle from entry.js and save it to dist.js
bundly --no-use-cache entry.js -o dist.js
```

### Minimize

if passed the option `-m, --minimize` the code will generate a minimized version of the passed file and add it the `.min.js` extension.
**Please note:** If --watch is true then this option will be skipped.

For example:

```bash
# this will generate both output.js and output.min.js
bundly -m entry.js -o output.js
```

Also the same can be achieved using a config file. **Options can be passed to uglifyJS in this mode**:

```javascript
// bundly.conf.js
module.exports = function () {
  return {
    src: 'entry.js',
    dest: 'output.js',
    options: {
      minimized: true,
      uglifyConfig: {
        mangle: false // pass options to uglifyJS
      }
    }
  }
};
```

and then use the config

```bash
bundly -c bundly.conf.js
```

### revision

Adds a revision number to the generated **regular** and **min** files.

For example:

```bash
# will generate the file output.123.js
bundly -r 123 entry.js -o output.js

# will generate the file output.123.js and output.123.min.js
bundly -m -r 123 entry.js -o output.js
```

Same can be done using the config file

```javascript
// bundly.conf.js
module.exports = function () {
  return {
    src: 'entry.js',
    dest: 'output.js',
    options: {
      revision: '123'
    }
  }
};
```

and then use the config

```bash
bundly -c bundly.conf.js
```

#### banner

Add a text block before the regular and min files

Example:

```bash
bundly -b '/*! this text will be added at the top */' entry.js -o output.js
```

Same can be done using the config file

```javascript
// bundly.conf.js
module.exports = function () {
  return {
    src: 'entry.js',
    dest: 'output.js',
    options: {
      banner: '/*! this text will be added at the top */'
    }
  }
};
```

and then use the config

```bash
bundly -c bundly.conf.js
```

## Install

```bash
npm i -g bundly
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
# object from browserify using the `preBundleCB` which can be specified in the options object
# see the bundly.conf.js example below
bundly -c bundly.conf.js
```
Config example:

```javascript
// bundly.conf.js
module.exports = function ( cli ) {
  // custom arguments can be pass using the `cli.opts._` array
  // for example bundly -c bundly-config -- debug b-cache b-watch
  // to enable debug, cache and watch.
  var debug = cli.opts._.indexOf( 'debug' ) > -1;
  var cache = cli.opts._.indexOf( 'b-cache' ) > -1;
  var watch = cli.opts._.indexOf( 'b-watch' ) > -1;

  return {
    src: 'src/foo.js',
    dest: 'dist/foo.js',
    options: {
      useCache: cache,
      watch: watch,

      preBundleCB: function ( b ) {
        if (debug) {
          cli.log('exposing bar as ./src/bar.js');
        }
        b.transform( require('consoleify') );
        b.require( './src/bar.js', { expose: 'bar' } );
      }
    }
  };
};
```

## NOTES:

- in `watch mode` the minified version won't be generated even if `-m` is specified. It is assumed that watch mode is only used for
  development so no need for the min file
- to destroy the cache and start fresh simply execute the command with the `--no-use-cache` flag.

## Changelog

[Changelog](./changelog.md)

## License

[MIT](./LICENSE)
