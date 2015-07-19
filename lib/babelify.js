var transformTools = require( 'browserify-transform-tools' );
var extend = require( 'extend' );

var options = {
  includeExtensions: [
    '.jsx',
    '.js',
    '.es6'
  ]
};

var transformExclude = require( 'browserify-transform-tools-exclude' );
var fnTransform = transformExclude( function ( content, transformOptions, done ) {
  var file = transformOptions.file;

  var configData = transformOptions.configData || { };
  var config = configData.config || { };

  var babelCore = require( 'babel-core' );
  try {
    content = babelCore.transform( content, extend( { }, config.babelConfig, {
      filename: file
    } ) ).code;
    done( null, content );
  } catch (ex) {
    done( ex );
  }
} );

module.exports = transformTools.makeStringTransform( 'babelify', options, fnTransform );
