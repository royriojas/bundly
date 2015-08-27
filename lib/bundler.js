var extend = require( 'extend' );
var dispatchy = require( 'dispatchy' );

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

        var useCache = opts.useCache;
        var persistifyOpts = {
          recreate: !useCache,
          watch: opts.watch,
          cacheId: id
        };

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
          configTransform( b, require( 'simplessy' ), transforms.simplessy );
          configTransform( b, require( 'dot-ify' ), transforms.dotify );

          configTransform( b, require( './babelify' ), transforms.babelify );
          configTransform( b, require( 'shimixify' ), shimixify );

          configTransform( b, require( 'console-filter' ), consoleFilter );
          configTransform( b, require( 'require-arr' ), transforms.requireArr );
        };

        function bundle() {
          var b = require( 'persistify' )( opts.browserifyOpts, persistifyOpts );

          if ( target.src ) {
            b.add( target.src );
          }

          opts.beforeTransforms && opts.beforeTransforms( b );
          commonTransforms( b );
          opts.afterTransforms && opts.afterTransforms( b );

          opts.preBundleCB && opts.preBundleCB( b );

          var doBundle = function ( _changedFiles ) {
            _changedFiles = _changedFiles || [ ];
            if ( _changedFiles.length > 0 ) {
              me.fire( 'bundler:files:updated', { files: _changedFiles } );
            }

            var time = Date.now();

            b.bundle( function ( err, buff ) {

              if ( err ) {
                me.fire( 'error', err );
                return;
              }

              opts.postBundle && opts.postBundle();

              var outp = buff.toString();
              done( target, time, outp );

            } );
          };

          opts.watch && b.on( 'update', doBundle );

          doBundle();
        }

        bundle();
      }
    } );
  }
};
