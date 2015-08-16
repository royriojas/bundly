module.exports = function ( content, file, stream, done ) {
  //var path = require( 'path' );

  var compileLess = require( 'simpless/lib/compile-less' );
  var autoPrefix = require( 'simpless/lib/autoprefix' );

  var funcStart = '(function() { var head = document.getElementsByTagName("head")[0]; var style = document.createElement("style"); style.type = "text/css";';
  var funcEnd = 'if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style);}())';

  compileLess( file, { compress: true } ).then( function ( result ) {
    return autoPrefix( result.css, {
      file: file,
      dest: '',
      autoprefixer: {
        browsers: [
          'last 2 versions'
        ]
      }
    } ).then( function ( compiled ) {
      /*eslint-disable*/
      compiled = funcStart + 'var css = "' + compiled.replace( /\\/g, '\\\\' ).replace( /'/g, '\\$&' ).replace( /"/g, '\\$&' ) + '";' + funcEnd;
      /*eslint-enable*/
      var imports = result.imports || [ ];

      imports.forEach( function ( _file ) {
        stream.emit( 'file', _file );
      } );

      done( null, compiled );
    } );
  }, function ( err ) {
    done( err );
  } );
};
