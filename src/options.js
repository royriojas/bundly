var path = require( 'path' );

module.exports = {
  pkgJSONPath: path.resolve( __dirname, '../package.json' ),
  configFile: {
    //defaultName: 'package.json',
    //pathToLocalConfig: path.resolve( __dirname, '../configs/bundly.json' ),
    description: 'Path to your `bundly` config. This can be used to specify the options instead of passing them on the command line'
  },
  //useDefaultOptions: true,
  optionator: {
    prepend: '`bundly` is a `watchify`/`browserify` wrapper with some useful preconfigured transforms and cache support\nto make it incremental builds even without the watch mode\n\n========================================================\nUsage: bundly -c bundly.conf.js\n       bundly [options] -o outfile.js entry-file.js\n========================================================',
    options: [
      {
        heading: 'Options'
      },
      {
        option: 'use-cache',
        alias: 'u',
        type: 'Boolean',
        //default: 'true',
        description: 'Whether or not to remember the files and contents and only operate on the changed files to create incremental builds. By default is true'
      },
      {
        option: 'watch',
        alias: 'w',
        type: 'Boolean',
        description: 'Continuosly watch for changes of the files and do incremental builds'
      },
      {
        option: 'minimize',
        alias: 'm',
        type: 'Boolean',
        description: 'Whether to minimize or not the output or not. By default is `false`. When the flag is set both the non minimified and minified versions will be created'
      },
      {
        option: 'output-file',
        alias: 'o',
        type: 'String',
        description: 'The path and name for the output file'
      },
      {
        option: 'revision',
        alias: 'r',
        type: 'String',
        description: 'The revision to use in the generated file names'
      },
      {
        option: 'banner',
        alias: 'b',
        type: 'String',
        description: 'The banner to put at the top of the compiled files'
      },
      {
        option: 'target',
        alias: 't',
        type: 'String',
        dependsOn: 'config',
        description: 'The name of the target to execute from all the posible targets'
      }
    ]
  }
};
