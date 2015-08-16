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
          browserifyOpts: {

          },
          useCache: true,
          transforms: {
            babelify: {
              global: false,
              disabled: false
            },
            shimixify: {
              global: false,
              disabled: false,
              config: {
                addDefaultShims: true,
                shims: {}
              }
            }
          }
        };

        opts = extend( true, opts, options );

        var transforms = opts.transforms || { };
        var consoleFilter = transforms.consoleFilter || { };

        if ( consoleFilter ) {
          var cOptions = consoleFilter.config || { };
          consoleFilter.disabled = !cOptions.keep;
        }

        var shimixify = transforms.shimixify || { };
        var shimixifyConfig = shimixify.config || { };

        if ( shimixifyConfig && shimixifyConfig.addDefaultShims ) {
          shimixify.config = extend( true, {
            shims: {
              window: 'global.window',
              screen: 'global.screen',
              document: 'global.document',
              Worker: 'global.Worker',
              Promise: 'global.Promise'
            }
          }, shimixifyConfig );
        }

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

        var configTransform = function ( b, transform, trConfig ) {
          trConfig = trConfig || { };
          if ( trConfig.disabled ) {
            return;
          }

          if ( trConfig.config ) {
            transform = transform.configure( trConfig.config );
          }

          b.transform( { global: trConfig.global }, transform );

        };

        var commonTransforms = function ( b ) {
          configTransform( b, require( './simplessy' ), transforms.simplessy );
          configTransform( b, require( './dotify' ), transforms.dotify );

          configTransform( b, require( './babelify' ), transforms.babelify );
          configTransform( b, require( 'shimixify' ), shimixify );

          configTransform( b, require( 'console-filter' ), consoleFilter );
          configTransform( b, require( 'require-arr' ), transforms.requireArr );
        };

        function bundle() {
          var wArgs = extend( {
            cache: {}, packageCache: {}
          }, opts.browserifyOpts );

          if ( useCache ) {
            wArgs = cache.getKey( 'watchifyArgs' ) || wArgs;

            if ( !wArgs ) {

              wArgs = {
                cache: {}, packageCache: {}
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

          opts.beforeTransforms && opts.beforeTransforms( b );
          commonTransforms( b );
          opts.afterTransforms && opts.afterTransforms( b );

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

              // if we're not watching just remove the listeners
              // this will just remove the listeners
              if ( !opts.watch ) {
                // trick to try to properly close watchify
                setTimeout( function () {
                  w.close && w.close();
                }, 100 );
              }

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
