// Copyright 2013, University of Colorado

/**
 * The navigation bar at the bottom of the screen.
 * For a single-tab sim, it shows the name of the sim at the left and the PhET Logo and options menu at the right.
 * For a multi-tab sim, it shows icons for all of the other tabs, with the tab name at the left and the PhET Logo and options menu at the right.
 *
 * @author Sam Reid
 */
define( function( require ) {
  "use strict";

  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var BoundsNode = require( 'SUN/BoundsNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimPopupMenu = require( 'JOIST/SimPopupMenu' );

  /**
   * Create a nav bar.  Layout assumes all of the tab widths are the same.
   * @param sim
   * @param tabs
   * @param model
   * @constructor
   */
  function NavigationBar( sim, tabs, model ) {
    var navigationBar = this;
    this.tabs = tabs;

    this.navBarHeight = 40;
    this.navBarScale = 1;
    this.navBarWidth = 768;

    Node.call( this, {renderer: 'svg'} );
    this.background = new Rectangle( 0, 0, 0, 0, {fill: 'black'} );
    this.addChild( this.background );

    var fontSize = 36;

    var phetLabel = new Text( "PhET", {fontSize: fontSize, fill: 'yellow'} );
    var optionsButton = new BoundsNode( new FontAwesomeNode( 'reorder', {fill: '#fff'} ), {cursor: 'pointer'} );

    //Creating the popup menu dynamically (when needed) causes a temporary black screen on the iPad (perhaps because of canvas accurate text bounds)
    var simPopupMenu = new SimPopupMenu( sim );
    var optionButtonPressed = function() {
      simPopupMenu.x = navigationBar.navBarWidth - simPopupMenu.width - 2;
      simPopupMenu.y = window.innerHeight - simPopupMenu.height - navigationBar.height / 2 + 4;
      var overlayScene = sim.createAndAddOverlay( simPopupMenu );
      overlayScene.addInputListener( {down: function() {
        sim.removeOverlay( overlayScene );
      }} );
    };

    // mousedown or touchstart (pointer pressed down over the node)
    optionsButton.addPeer( '<input type="button">', {click: optionButtonPressed, tabIndex: 101} );
    optionsButton.addInputListener( { down: optionButtonPressed } );

    this.phetLabelAndButton = new HBox( {spacing: 10, children: [phetLabel, optionsButton]} );
    this.addChild( this.phetLabelAndButton );

    this.titleLabel = new Text( sim.name, {fontSize: 18, fill: 'white'} );

    //Create the nodes to be used for the tab icons
    var index = 0;
    var iconAndTextArray = _.map( tabs, function( tab ) {
      var icon = new Node( {children: [tab.icon], scale: 25 / tab.icon.height} );
      var text = new Text( tab.name, {fontSize: 10, fill: 'white', visible: true} );

      var iconAndText = new VBox( {children: [icon, text]} );
      iconAndText.icon = icon;
      iconAndText.text = text;
      iconAndText.index = index++;
      iconAndText.tab = tab;

      //On initialization and when the tab changes, update the size of the icons and the layout of the icons and text
      model.tabIndexProperty.link( function( tabIndex ) {
        var selected = iconAndText.index === tabIndex;
        iconAndText.text.fill = selected ? 'yellow' : 'white';
        iconAndText.opacity = selected ? 1.0 : 0.5;
      } );

      return iconAndText;
    } );

    //Make all of the icons the same size so they will have equal hit areas and equal spacing
    var maxWidth = _.max( iconAndTextArray,function( iconAndText ) {return iconAndText.width;} ).width;
    var maxHeight = _.max( iconAndTextArray,function( iconAndText ) {return iconAndText.height;} ).height;

    this.buttonArray = iconAndTextArray.map( function( iconAndText ) {
      var rectangle = new Rectangle( 0, 0, maxWidth, maxHeight );
      iconAndText.centerX = maxWidth / 2;
      iconAndText.top = 0;
      var button = new Node( {children: [ rectangle, iconAndText], cursor: 'pointer'} );

      var listener = function() {
        model.tabIndex = iconAndText.index;
        model.showHomeScreen = false;
      };
      button.addInputListener( { down: listener} );

      button.addPeer( '<input type="button">', {click: listener, tabIndex: 99} );
      return  button;
    } );

    //Add everything to the scene
    this.buttonHBox = new HBox( {children: this.buttonArray} );
    this.addChild( this.buttonHBox );
    this.addChild( this.titleLabel );

    //add the home icon
    this.homeIcon = new BoundsNode( new FontAwesomeNode( 'home', {fill: '#fff'} ), {cursor: 'pointer'} );
    this.homeIcon.addInputListener( {down: function() { model.showHomeScreen = true; }} );
    this.homeIcon.addPeer( '<input type="button">', {click: function() {model.showHomeScreen = true;}, tabIndex: 100} );
    if ( tabs.length > 1 ) {
      this.addChild( this.homeIcon );
    }
  }

  inherit( Node, NavigationBar, {relayout: function() {
    var navigationBar = this;
    navigationBar.background.rectHeight = this.navBarHeight;
    navigationBar.background.rectWidth = this.navBarWidth;
    var tabIndex = navigationBar.tabIndex;

    this.buttonHBox.setScaleMagnitude( navigationBar.navBarScale );

    this.titleLabel.setScaleMagnitude( this.navBarScale );
    this.titleLabel.centerY = this.navBarHeight / 2;
    this.titleLabel.left = 10;

    //Lay out the components from left to right
    if ( this.tabs.length !== 1 ) {

      //put the center right in the middle
      this.buttonHBox.centerX = this.navBarWidth / 2;
      this.buttonHBox.top = 2;

      navigationBar.homeIcon.setScaleMagnitude( this.navBarScale );
      navigationBar.homeIcon.centerY = this.navBarHeight / 2;
      navigationBar.homeIcon.left = navigationBar.buttonHBox.right + 15;
    }
    this.phetLabelAndButton.setScaleMagnitude( this.navBarScale );
    this.phetLabelAndButton.right = this.navBarWidth - 5;
    this.phetLabelAndButton.centerY = this.navBarHeight / 2;
  },
    layout: function( scale, width, height, windowHeight ) {
      this.navBarScale = scale;
      this.navBarWidth = width;
      this.navBarHeight = height;
      this.relayout();
    }} );

  return NavigationBar;
} );
