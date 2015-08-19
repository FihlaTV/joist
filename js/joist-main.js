// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main file for the Joist demo.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DialogsDemoView = require( 'JOIST/demo/DialogsDemoView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var title = require( 'string!JOIST/joist.name' );

  var screens = [
        new Screen( 'Dialogs',
          new Rectangle( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, { fill: 'white' } ),
          function() { return {}; },
          function( model ) { return new DialogsDemoView(); },
          { backgroundColor: 'white' }
        ),
        new Screen( 'Dialogs 2',
          new Rectangle( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, { fill: 'white' } ),
          function() { return {}; },
          function( model ) { return new DialogsDemoView(); },
          { backgroundColor: 'white' }
        )
      ];

  var options = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  SimLauncher.launch( function() {
    new Sim( title, screens, options ).start();
  } );
} );
