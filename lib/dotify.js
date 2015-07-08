var transformTools = require( 'browserify-transform-tools' );
var path = require( 'path' );
var dotCompiler = require( './dot-compiler' );

var options = {
  excludeExtensions: [
    '.json'
  ]
};

module.exports = transformTools.makeStringTransform( 'dotify', options, function ( content, transformOptions, done ) {
  var file = transformOptions.file;

  var extension = path.extname( file );

  var ext = extension.toLowerCase();

  if ( ext === '.dot' || ext === '.tpl' ) {
    try {
      content = dotCompiler.compile( content );
    } catch (ex) {
      done( ex.message );
    }
  }
  done( null, content );
} );
