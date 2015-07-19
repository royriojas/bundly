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
var transformExclude = require( 'browserify-transform-tools-exclude' );
var fnTransform = transformExclude( function ( content, transformOptions, done ) {
  var file = transformOptions.file;

  try {
    compileLess( content, file, done );
    return;
  } catch (ex) {
    done( ex.message );
  }

  done( null, content );
} );

module.exports = transformTools.makeStringTransform( 'simplessy', options, fnTransform );
