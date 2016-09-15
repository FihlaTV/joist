// Copyright 2013-2015, University of Colorado Boulder

/**
 * The "Settings" dialog.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var joist = require( 'JOIST/joist' );

  // strings
  var showPointersString = require( 'string!JOIST/showPointers' );
  var doneString = require( 'string!JOIST/done' );
  var titleSettingsString = require( 'string!JOIST/title.settings' );

  /**
   * @param {Property.<boolean>} showPointersProperty - whether the sim should show graphical indicators for where the pointers are
   * @constructor
   */
  function SettingsDialog( showPointersProperty ) {
    var self = this;

    //Use view, to help center and scale content
    ScreenView.call( this );

    var content = new VBox( {
      align: 'center', spacing: 50, children: [
        new Text( titleSettingsString, { font: new PhetFont( 16 ) } ),
        new CheckBox( new Text( showPointersString, { font: new PhetFont( 10 ) } ), showPointersProperty ),
        new TextPushButton( doneString, {
          font: new PhetFont( 20 ),
          listener: function() {
            self.doneListeners.forEach( function( listener ) {
              listener();
            } );
          }
        } )
      ]
    } );

    //Show a gray overlay that will help focus on the about dialog, and prevent clicks on the sim while the dialog is up
    this.addChild( new Panel( content, {
      centerX: this.layoutBounds.centerX,
      centerY: this.layoutBounds.centerY,
      xMargin: 20,
      yMargin: 20
    } ) );

    function resize() {
      self.layout( $( window ).width(), $( window ).height() );
    }

    //Fit to the window and render the initial scene
    $( window ).resize( resize );
    resize();
    this.doneListeners = []; // @private
  }

  joist.register( 'SettingsDialog', SettingsDialog );

  return inherit( ScreenView, SettingsDialog, {

    // @public (scenery-internal)
    addDoneListener: function( listener ) {
      this.doneListeners.push( listener );
    }
  } );
} );
