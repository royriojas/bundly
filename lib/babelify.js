var transformTools = require( 'browserify-transform-tools' );
var extend = require( 'extend' );
var path = require( 'path' );

var options = {
  excludeExtensions: [
    '.json'
  ]
};

module.exports = transformTools.makeStringTransform( 'babelify', options, function ( content, transformOptions, done ) {
  var file = transformOptions.file;
  var ext = path.extname( file );

  var configData = transformOptions.configData || { };
  var config = configData.config || { };

  if ( !config.extensions[ ext ] || (config.checkIfSkip && config.checkIfSkip( file )) ) {
    done( null, content );
    return;
  }

  var babelCore = require( 'babel-core' );
  content = babelCore.transform( content, extend( config.options, {
    filename: file
  } ) ).code;

  done( null, content );
} );
