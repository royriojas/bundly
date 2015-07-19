var crypto = require( 'crypto' );
var extend = require( 'extend' );
var dispatchy = require( 'dispatchy' );
var ES6Promise = require( 'es6-promise' ).Promise;
var write = require( 'write' ).sync;
var path = require( 'path' );

var md5 = function ( str, encoding ) {
  return crypto
    .createHash( 'md5' )
    .update( str + '' )
    .digest( encoding || 'hex' );
};

var makeMinName = function ( fileName ) {
  var rgex = /(.+)\.(\w+)$/gi;
  return fileName.replace( rgex, '$1.min.$2' );
};

var addVersion = function ( fileName, bNumber ) {
  var rgex = /(.+)\.(\w+)$/gi;
  return fileName.replace( rgex, '$1.' + bNumber + '.$2' );
};

var bundlyProto = extend( dispatchy.create(), {
  init: function ( data, opts ) {
    var me = this;
    me.data = data;
    me.opts = opts;

    var src = Array.isArray( data.src ) ? data.src[ 0 ] : data.src;
    var hash = md5( src );

    me.bundler = require( './lib/bundler' ).create( 'b-t-' + hash );
  },
  bundle: function () {
    var me = this;
    var opts = me.opts;
    var data = me.data;
    var banner = opts.banner;

    return new ES6Promise( function ( resolve ) {

      var bundler = me.bundler;

      var doResolve = function () {
        setTimeout( resolve, 1 );
      };

      var _dest = data.dest;
      var dest = opts.revision ? addVersion( _dest, opts.revision ) : _dest;
      dest = path.resolve( dest );

      bundler.on( 'bundler:done', function ( e, args ) {

        write( dest, banner + opts.separator + args.result );

        me.fire( 'file-write', {
          dest: dest,
          duration: Date.now() - args.startTime
        } );

        if ( opts.watch ) {
          // run forever, waiting for the next bundle cycle
          me.fire( 'watch-mode-on' );
          doResolve();
          return;
        }

        if ( opts.minimize ) {
          var tStart = Date.now();

          var uglify = require( 'uglify-js' );

          var result = uglify.minify( args.result, extend( true, {
            mangle: true
          }, opts.uglifyConfig, { fromString: true } ) );

          var minFile = path.resolve( makeMinName( dest ) );

          write( minFile, banner + opts.separator + result.code );

          me.fire( 'file-write:minify', {
            dest: minFile,
            duration: Date.now() - tStart / 1000
          } );
        }

        doResolve();

      } );

      bundler.on( 'bundler:files:updated', function ( e, args ) {
        me.fire( 'files-updated', args );
      } );

      bundler.on( 'bundler:read-file', function ( e, args ) {
        me.fire( 'read-file', args );
      } );

      bundler.on( 'error', function ( e, err ) {
        me.fire( 'error', err );
      } );

      bundler.bundle( { src: data.src }, opts );
    } );
  }
} );

module.exports = {
  create: function ( data, opts ) {
    var ins = Object.create( bundlyProto );
    ins.init( data, opts );
    return ins;
  }
};
