var transformTools = require( 'browserify-transform-tools' );
var path = require( 'path' );
var compileLess = require( './compile-less' );

var options = {
  excludeExtensions: [
    '.json'
  ]
};

module.exports = transformTools.makeStringTransform( 'lessify', options, function ( content, transformOptions, done ) {
  var file = transformOptions.file;

  var extension = path.extname( file );

  var ext = extension.toLowerCase();

  if ( ext === '.css' || ext === '.less' ) {
    try {
      compileLess( content, file, done );
      return;
    } catch (ex) {
      done( ex.message );
    }
  }
  done( null, content );
} );
