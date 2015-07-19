module.exports = {
  run: function ( cli ) {
    var path = require( 'path' );
    var nodeProcess = require( '../lib/process' );
    var cliOpts = cli.opts;
    var extend = require( 'extend' );
    var moment = require( 'moment' );

    var bundlyArgs = {
      src: '',
      dest: '',
      options: {
        watch: false,
        banner: '',
        minimize: false,
        useCache: true,
        separator: '\n\n',
        revision: ''
      }
    };

    if ( cliOpts.config ) {
      var config = cli.getConfig();
      if ( config ) {
        extend( true, bundlyArgs, config );
      }
    } else {
      if ( cliOpts._.length > 0 ) {
        bundlyArgs.src = path.resolve( nodeProcess.cwd(), cliOpts._[ 0 ] );
      }
      if ( cliOpts.outputFile ) {
        bundlyArgs.dest = path.resolve( nodeProcess.cwd(), cliOpts.outputFile );
      }

      extend( true, bundlyArgs.options, cliOpts );
    }

    var bundly = require( '../index' ).create( {
      src: bundlyArgs.src,
      dest: bundlyArgs.dest
    }, bundlyArgs.options );

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
      if ( !bundlyArgs.options.watch ) {
        nodeProcess.exit();
      }
    } );

    bundly.bundle().then( function () {
      if ( !bundlyArgs.options.watch ) {
        cli.ok( 'bundly done!' );
        nodeProcess.exit();
      }
    } );
  }
};
