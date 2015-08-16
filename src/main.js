var ES6Promise = require( 'es6-promise' ).Promise;
var extend = require( 'extend' );
module.exports = {
  runTarget: function ( dataEntry, cli ) {

    var _files = dataEntry.files;
    var options = extend( true, dataEntry.options, cli.opts );
    cli.log( 'running', dataEntry.name );
    return _files.reduce( function ( seq, data ) {
      return seq.then( function () {
        var path = require( 'path' );
        //var nodeProcess = require( '../lib/process' );
        var moment = require( 'moment' );

        var bundly = require( '../index' ).create( {
          src: path.resolve( data.src[ 0 ] ),
          dest: path.resolve( data.dest )
        }, options );

        bundly.on( 'files-updated', function ( e, args ) {
          var files = args.files || [ ];

          cli.subtle( [
            '\n updated files \n -',
            files.join( '\n - ' ),
            '\n'
          ].join( ' ' ) );
        } );

        bundly.on( 'read-file', function ( e, args ) {
          cli.log( 'Reading file ', args.file );
        } );

        bundly.on( 'file-write', function ( e, args ) {
          cli.ok( 'File written', args.dest, 'time required:', args.duration );
        } );

        bundly.on( 'file-write:minify', function ( e, args ) {
          cli.ok( 'Minified file written', args.dest, 'time required:', args.duration );
        } );

        bundly.on( 'watch-mode-on', function () {
          cli.subtle( '[' + moment().format( 'MM/DD/YYYY HH:mm:ss' ) + ']', '...Waiting for changes...\n\n' );
        } );

        bundly.on( 'error', function ( e, err ) {
          // error will break the execution
          // important will just wait until next change to attempt to execute the fix
          //var method = opts.watch ? 'subtle' : 'error';
          cli.subtle( '\n\nerror:' + JSON.stringify( err.message, null, 2 ) + '\n\n' );
          if ( !options.watch ) {
            throw err;
          }
        } );

        return bundly.bundle();
      } );
    }, ES6Promise.resolve() );
  },

  run: function ( cli ) {
    var me = this;
    var path = require( 'path' );
    var nodeProcess = require( '../lib/process' );
    var cliOpts = cli.opts;


    var bundlyArgs = {
      //src: '',
      //dest: '',
      options: {
        watch: false,
        banner: '',
        minimize: false,
        useCache: true,
        separator: '\n\n',
        revision: ''
      }
    };

    var targets = [ ];

    if ( cliOpts.config ) {
      var config = cli.getConfig();

      if ( config ) {
        extend( true, bundlyArgs, config );
      }
      targets = targets.concat( cli.getTargets( bundlyArgs, cliOpts.target ) );
    } else {
      var files = [ ];
      var entry = { };
      if ( cliOpts._.length > 0 ) {
        entry.src = [ cliOpts._[ 0 ] ];
      }
      if ( cliOpts.outputFile ) {
        entry.dest = path.resolve( nodeProcess.cwd(), cliOpts.outputFile );
      }

      var options = extend( true, bundlyArgs.options, cliOpts );

      files.push( entry );

      targets = [
        {
          files: files, options: options
        }
      ];
    }

    var p = targets.reduce( function ( seq, dataEntry ) {
      return seq.then( function () {
        return me.runTarget( dataEntry, cli );
      } );
    }, ES6Promise.resolve() );

    p.then( function () {
      //if ( !opts.watch ) {
      cli.ok( 'bundly done!' );
    //}
    }, function ( err ) {
      cli.error( err );
      throw err;
    // nodeProcess.exit(1);
    } );
  }
};
