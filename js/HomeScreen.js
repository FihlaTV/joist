// Copyright 2015-2020, University of Colorado Boulder

/**
 * Screen for the home screen, which shows icons for selecting the sim content screens.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const HomeScreenModel = require( 'JOIST/HomeScreenModel' );
  const HomeScreenView = require( 'JOIST/HomeScreenView' );
  const inherit = require( 'PHET_CORE/inherit' );
  const joist = require( 'JOIST/joist' );
  const merge = require( 'PHET_CORE/merge' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // constants
  const BACKGROUND_COLOR = 'black';

  /**
   *
   * @constructor
   */
  function HomeScreen( sim, tandem, options ) {

    options = merge( {

      //TODO get this color from LookAndFeel, see https://github.com/phetsims/joist/issues/255
      backgroundColorProperty: new Property( BACKGROUND_COLOR )
    }, options );

    assert && assert( !options.tandem, 'tandem is a required constructor parameter, not an option' );
    options.tandem = tandem;

    Screen.call( this,

      // createModel
      () => new HomeScreenModel( sim, tandem.createTandem( 'model' ) ),

      // createView
      model => new HomeScreenView( sim.name, model, tandem.createTandem( 'view' ), _.pick( options, [
        'warningNode'
      ] ) ),

      options
    );
  }

  joist.register( 'HomeScreen', HomeScreen );

  return inherit( Screen, HomeScreen, {}, {

    // @public
    BACKGROUND_COLOR: BACKGROUND_COLOR
  } );
} );