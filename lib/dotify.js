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

module.exports = transformTools.makeStringTransform( 'dotify', options, function ( content, transformOptions, done ) {

  try {
    content = dotCompiler.compile( content );
  } catch (ex) {
    done( ex );
  }

  done( null, content );
} );
