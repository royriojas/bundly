var transformTools = require( 'browserify-transform-tools' );
var dotCompiler = require( './dot-compiler' );

var options = {
  excludeExtensions: [
    '.js',
    '.jsx',
    '.json'
  ],
  includeExtensions: [
    '.dot',
    '.tpl'
  ]
};

var transformExclude = require( 'browserify-transform-tools-exclude' );
var fnTransform = transformExclude( function ( content, transformOptions, done ) {
  try {
    content = dotCompiler.compile( content );
    done( null, content );
  } catch (ex) {
    done( ex );
  }
} );

module.exports = transformTools.makeStringTransform( 'dotify', options, fnTransform );
