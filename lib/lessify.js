var transformTools = require( 'browserify-transform-tools' );
var compileLess = require( './compile-less' );

var options = {
  excludeExtensions: [
    '.jsx',
    '.js',
    '.json'
  ],
  includeExtensions: [
    '.css',
    '.less'
  ]
};

module.exports = transformTools.makeStringTransform( 'lessify', options, function ( content, transformOptions, done ) {
  var file = transformOptions.file;

  try {
    compileLess( content, file, done );
    return;
  } catch (ex) {
    done( ex.message );
  }

  done( null, content );
} );
