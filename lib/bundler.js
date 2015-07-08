var extend = require( 'extend' );
var dispatchy = require( 'dispatchy' );
var flatCache = require( 'flat-cache' );
var fileEntryCache = require( 'file-entry-cache' );
var expand = require( 'glob-expand' );

module.exports = {
  create: function ( id ) {

    return extend( dispatchy.create(), {
      id: id,
      bundle: function ( target, options ) {
        var me = this;
        var opts = {
          useCache: true,
          stricterify: {
            disabled: true
          },
          consoleify: {
            disabled: true
          },
          babelify: {
            globalTransform: false,
            disabled: false,
            extensions: {
              '.js': true,
              '.jsx': true
            },
            options: {},
            checkIfSkip: function () {
              return false;
            }
          },
          shimixify: {
            shims: {
              window: 'global.window',
              jQuery: 'global.jQuery',
              chrome: 'global.chrome',
              screen: 'global.screen',
              document: 'global.document',
              Worker: 'global.Worker',
              Promise: 'global.Promise',
              self: 'global.self'
            }
          }
        };

        opts = extend( true, opts, options );

        var cache;
        var depsCacheFile;

        var useCache = opts.useCache || opts.watch;

        if ( useCache ) {

          cache = flatCache.load( id );
          //console.log('cache', cache);
          depsCacheFile = fileEntryCache.create( 'deps-cx-' + id );
        } else {
          flatCache.clearCacheById( id );
        }

        var watchify = require( 'watchify' );
        var browserify = require( 'browserify' );

        var done = function ( receivedTarget, time, text ) {

          me.fire( 'bundler:done', {
            result: text,
            target: receivedTarget,
            startTime: time
          } );

          return text;
        };

        var commonTransforms = function ( b ) {

          var lessify = require( './lessify' );

          b.transform( { global: true }, lessify );

          var shimify = require( 'shimixify' ).configure( opts.shimixify );
          var cFilter = require( 'console-filter' );

          if ( !opts.stricterify.disabled ) {
            b.transform( require( 'stricterify' ).configure( opts.stricterify ) );
          }

          b.transform( { global: true }, require( './dotify' ) );

          var babelify = opts.babelify || { };

          if ( !babelify.disabled ) {
            b.transform( { global: babelify.globalTransform }, require( './babelify' ).configure( babelify ) );
          }

          b.transform( { global: true }, shimify );

          if ( !opts.consoleify.disabled ) {
            b.transform( require( 'consoleify' ) );
          }

          b.transform( { global: true }, require( 'require-arr' ) );

          var filter = opts.consoleFilter;

          if ( filter ) {
            b.transform( cFilter.configure( { filter: filter } ) );
          }
        };

        function bundle() {
          var wArgs = {
            cache: {},
            packageCache: {}
          };

          if ( useCache ) {
            wArgs = cache.getKey( 'watchifyArgs' ) || wArgs;

            if ( !wArgs ) {

              wArgs = {
                cache: {},
                packageCache: {}
              };

              cache.setKey( 'watchifyArgs', wArgs );
            }

            var changedFiles = depsCacheFile.getUpdatedFiles( expand.apply( null, Object.keys( wArgs.cache ) ) );
            if ( changedFiles.length > 0 ) {
              me.fire( 'bundler:files:updated', { files: changedFiles } );
            }
            changedFiles.forEach( function ( file ) {
              delete wArgs.cache[ file ];
            } );
          }

          var watchifyArgs = wArgs;

          var b = browserify( watchifyArgs );

          if ( target.src ) {
            b.add( target.src );
          }

          commonTransforms( b );

          opts.preBundleCB && opts.preBundleCB( b );

          var w = (opts.watch || opts.useCache) ? watchify( b ) : b;

          var doBundle = function ( _changedFiles ) {
            _changedFiles = _changedFiles || [ ];
            if ( _changedFiles.length > 0 ) {
              me.fire( 'bundler:files:updated', { files: _changedFiles } );
            }

            var time = Date.now();

            w.bundle( function ( err, buff ) {

              if ( err ) {
                me.fire( 'error', err );
                return;
              }

              opts.postBundle && opts.postBundle();

              if ( useCache ) {
                setTimeout( function () {
                  cache.setKey( 'watchifyArgs', watchifyArgs );
                  cache.save();
                  depsCacheFile.getUpdatedFiles( expand.apply( null, Object.keys( watchifyArgs.cache ) ) );
                  depsCacheFile.reconcile();
                }, 0 );
              }

              var outp = buff.toString();
              done( target, time, outp );

            } );
          };

          opts.watch && w.on( 'update', doBundle );

          doBundle();

        }

        bundle();
      }
    } );
  }
};
