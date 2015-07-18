var transformTools = require( 'browserify-transform-tools' );
var extend = require( 'extend' );

var options = {
  excludeExtensions: [
    '.json'
  ],
  includeExtensions: [
    '.jsx',
    '.js',
    '.es6'
  ]
};

module.exports = transformTools.makeStringTransform( 'babelify', options, function ( content, transformOptions, done ) {
  var file = transformOptions.file;

  var configData = transformOptions.configData || { };
  var config = configData.config || { };

  var babelCore = require( 'babel-core' );
  content = babelCore.transform( content, extend( config.options, {
    filename: file
  } ) ).code;

  done( null, content );
} );
