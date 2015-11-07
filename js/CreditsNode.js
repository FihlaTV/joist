// Copyright 2015, University of Colorado Boulder

/**
 * Displays the credits section in the About dialog
 */
define( function( require ) {
  'use strict';

  // modules
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  var creditsTitleString = require( 'string!JOIST/credits.title' );
  var creditsLeadDesignString = require( 'string!JOIST/credits.leadDesign' );
  var creditsSoftwareDevelopmentString = require( 'string!JOIST/credits.softwareDevelopment' );
  var creditsTeamString = require( 'string!JOIST/credits.team' );
  var creditsQualityAssuranceString = require( 'string!JOIST/credits.qualityAssurance' );
  var creditsGraphicArtsString = require( 'string!JOIST/credits.graphicArts' );
  var creditsTranslationString = require( 'string!JOIST/credits.translation' );
  var creditsThanksString = require( 'string!JOIST/credits.thanks' );

  /**
   * Creates node that displays the credits.
   * @param {Object} credits - see implementation herein for supported {string} fields
   * @param {Object} [options] - Passed to VBox
   * @constructor
   */
  function CreditsNode( credits, options ) {
    var titleFont = new PhetFont( { size: 14, weight: 'bold' } );
    var font = new PhetFont( 12 );
    var multiLineTextOptions = { font: font, align: 'left' };
    var children = [];

    // Credits
    children.push( new Text( creditsTitleString, { font: titleFont } ) );
    if ( credits.leadDesign ) { children.push( new MultiLineText( StringUtils.format( creditsLeadDesignString, credits.leadDesign ), multiLineTextOptions ) ); }
    if ( credits.softwareDevelopment ) { children.push( new MultiLineText( StringUtils.format( creditsSoftwareDevelopmentString, credits.softwareDevelopment ), multiLineTextOptions ) ); }
    if ( credits.team ) { children.push( new MultiLineText( StringUtils.format( creditsTeamString, credits.team ), multiLineTextOptions ) ); }
    if ( credits.qualityAssurance ) { children.push( new MultiLineText( StringUtils.format( creditsQualityAssuranceString, credits.qualityAssurance ), multiLineTextOptions ) ); }
    if ( credits.graphicArts ) { children.push( new MultiLineText( StringUtils.format( creditsGraphicArtsString, credits.graphicArts ), multiLineTextOptions ) ); }

    //TODO see joist#163, translation credit should be obtained from string files
    // Translation
    if ( credits.translation ) {
      if ( children.length > 0 ) { children.push( new VStrut( 10 ) ); }
      children.push( new Text( creditsTranslationString, { font: titleFont } ) );
      children.push( new MultiLineText( credits.translation, multiLineTextOptions ) );
    }

    // Thanks
    if ( credits.thanks ) {
      if ( children.length > 0 ) { children.push( new VStrut( 10 ) ); }
      children.push( new Text( creditsThanksString, { font: titleFont } ) );
      children.push( new MultiLineText( credits.thanks, multiLineTextOptions ) );
    }

    VBox.call( this, _.extend( { align: 'left', spacing: 1, children: children }, options ) );
  }

  return inherit( VBox, CreditsNode );
} );
