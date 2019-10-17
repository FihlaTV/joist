// Copyright 2016-2019, University of Colorado Boulder

/**
 * The button that pops up the Keyboard Help Dialog, which appears in the right side of the navbar and
 * to the left of the PhetButton.
 *
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const joist = require( 'JOIST/joist' );
  const JoistA11yStrings = require( 'JOIST/JoistA11yStrings' );
  const JoistButton = require( 'JOIST/JoistButton' );
  const KeyboardHelpDialog = require( 'JOIST/KeyboardHelpDialog' );
  const merge = require( 'PHET_CORE/merge' );

  // images
  const brightIconMipmap = require( 'mipmap!JOIST/keyboard-icon.png' ); // on a black navbar
  const darkIconMipmap = require( 'mipmap!JOIST/keyboard-icon-on-white.png' ); // on a white navbar
  assert && assert( Array.isArray( brightIconMipmap ), 'icon must be a mipmap' );

  // a11y strings
  const hotKeysAndHelpString = JoistA11yStrings.hotKeysAndHelp.value;

  // constants
  const HELP_BUTTON_HEIGHT = 67;
  const HELP_BUTTON_SCALE = 0.30;  // scale applied to the icon
  const BUTTON_SCALE = HELP_BUTTON_SCALE / brightIconMipmap[ 0 ].height * HELP_BUTTON_HEIGHT;

  /**
   * @param {Node} helpContent - content for the KeyboardHelpDialog
   * @param {Property.<Color|string>} backgroundColorProperty
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function KeyboardHelpButton( helpContent, backgroundColorProperty, tandem, options ) {
    const self = this;

    // reuse one instance of KeyboardHelpDialog
    let keyboardHelpDialog = null;

    options = merge( {
      highlightExtensionWidth: 5,
      highlightExtensionHeight: 10,

      // The keyboard button is not vertically symmetric, due to the cable on the top.
      // This offset adjusts the body of the keyboard to be in the center, so it
      // will align with the speaker button and the PhET logo
      highlightCenterOffsetY: 2,

      // a11y
      tagName: 'button',
      innerContent: hotKeysAndHelpString
    }, options );

    assert && assert( !options.listener, 'KeyboardHelpButton set\'s its own listener' );

    const openDialog = function() {
      if ( !keyboardHelpDialog ) {
        keyboardHelpDialog = new KeyboardHelpDialog( helpContent, {
          focusOnCloseNode: self,
          tandem: tandem.createTandem( 'keyboardHelpDialog' )
        } );
      }
      keyboardHelpDialog.show();

      // if listener was fired because of accessibility
      if ( self.buttonModel.isA11yClicking() ) {

        // focus the close button if the dialog is open with a keyboard
        keyboardHelpDialog.focusCloseButton();
      }
    };
    options.listener = openDialog;

    const icon = new Image( brightIconMipmap, {
      scale: BUTTON_SCALE,
      pickable: false
    } );

    JoistButton.call( this, icon, backgroundColorProperty, tandem, options );

    // change the icon so that it is visible when the background changes from dark to light
    backgroundColorProperty.link( function( backgroundColor ) {
      icon.image = backgroundColor === 'black' ? brightIconMipmap : darkIconMipmap;
    } );
  }

  joist.register( 'KeyboardHelpButton', KeyboardHelpButton );

  return inherit( JoistButton, KeyboardHelpButton );

} );