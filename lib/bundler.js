var extend = require( 'extend' );
var dispatchy = require( 'dispatchy' );

module.exports = {
  create: function ( id ) {

    return extend( dispatchy.create(), {
      id: id,
      bundle: function ( target, options ) {
        var me = this;
        var opts = {
          browserifyOpts: {}, useCache: true
        };

        opts = extend( true, opts, options );

        var useCache = opts.useCache;

        var persistifyOpts = {
          recreate: !useCache,
          watch: opts.watch,
          cacheId: id,
          neverCache: opts.neverCache // pass the neverCache option
        };

        var done = function ( receivedTarget, time, text ) {

          me.fire( 'bundler:done', {
            result: text,
            target: receivedTarget,
            startTime: time
          } );

          return text;
        };

        // attempt to make the cache to be ignored when the options change
        // the cmd string is the combination of the JSON.stringify of the options
        // plus the id and the serialization of the preBundleCB/postBundle callbacks
        var cmd = JSON.stringify( opts ) + id;

        if ( opts.preBundleCB ) {
          cmd += opts.preBundleCB.toString();
        }
        if ( opts.postBundle ) {
          cmd += opts.postBundle.toString();
        }

        function bundle() {
          var b = require( 'persistify' )( opts.browserifyOpts, extend( persistifyOpts, {
            command: cmd
          } ) );

          if ( target.src ) {
            b.add( target.src );
          }

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
