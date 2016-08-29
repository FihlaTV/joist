// Copyright 2013-2015, University of Colorado Boulder

/**
 * A Screen is the largest chunk of a simulation. (Java sims used the term Module, but that term
 * is too overloaded to use with JavaScript and Git.)
 * <p>
 * When creating a Sim, Screens are supplied as the arguments. They can be specified as object literals or through instances of this class.
 * This class may centralize default behavior or state for Screens in the future, but right now it only allows you to create
 * Sims without using named parameter object literals.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var joist = require( 'JOIST/joist' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * For showing ScreenView layoutBounds with 'dev' query parameter.
   * @param {Bounds2} layoutBounds
   * @returns {Node}
   */
  var devCreateLayoutBoundsNode = function( layoutBounds ) {
    return new Path( Shape.bounds( layoutBounds ), {
      stroke: 'red',
      lineWidth: 3,
      pickable: false
    } );
  };

  /**
   * For showing ScreenView layoutBounds with 'showVisibleBounds' query parameter.
   * @param {ScreenView} screenView
   * @returns {Node}
   */
  var devCreateVisibleBoundsNode = function( screenView ) {
    var path = new Path( Shape.bounds( screenView.visibleBoundsProperty.value ), {
      stroke: 'blue',
      lineWidth: 6,
      pickable: false
    } );
    screenView.visibleBoundsProperty.link( function( visibleBounds ) {
      path.shape = Shape.bounds( visibleBounds );
    } );
    return path;
  };

  /**
   * @param {string} name
   * @param {Node} homeScreenIcon optimal size is 548x373, will be scaled by HomeScreenView
   * @param {function} createModel
   * @param {function} createView
   * @param {Object} [options]
   * @constructor
   */
  function Screen( name, homeScreenIcon, createModel, createView, options ) {

    options = _.extend( {
      backgroundColor: 'white', // {Color|string} - Initial background color of the screen
      navigationBarIcon: homeScreenIcon // must be a minimum of 147x100 and have an aspect ratio of 548/373=1.469.  See https://github.com/phetsims/joist/issues/76
      // the tandem is optional, supplied only for instrumented simulations
    }, options );

    // Home screen does not use tandem in its options, since tandem is required in joist.
    if ( name !== null ) {
      Tandem.validateOptions( options ); // The tandem is required when brand==='phet-io'
    }

    if ( options.tandem ) {

      // @private (read-only, joist)
      this.tandem = options.tandem;
    }

    var backgroundColor = options.backgroundColor;
    if ( typeof backgroundColor === 'string' ) {
      backgroundColor = new Color( backgroundColor );
    }

    PropertySet.call( this, {
      backgroundColor: backgroundColor // @public
    } );

    this.name = name;                                   // @public
    this.homeScreenIcon = homeScreenIcon;               // @public
    this.navigationBarIcon = options.navigationBarIcon; // @public
    this.createModel = createModel;                     // @private
    this.createView = createView;                       // @private

    // Construction of the model and view are delayed and controlled to enable features like
    // a) faster loading when only loading certain screens
    // b) showing a loading progress bar <not implemented>
    this._model = null; // @private
    this._view = null;  // @private
  }

  joist.register( 'Screen', Screen );

  return inherit( PropertySet, Screen, {

    // @public - Returns the model (if it has been constructed)
    get model() {
      assert && assert( this._model, 'Model has not yet been constructed' );
      return this._model;
    },

    // @public - Returns the view (if it has been constructed)
    get view() {
      assert && assert( this._view, 'View has not yet been constructed' );
      return this._view;
    },

    /**
     * Initialize the model.  Clients should use either this or initializeModelAndView
     * Clients may want to use this method to gain more control over the creation process
     * @public (joist-internal)
     */
    initializeModel: function() {
      assert && assert( this._model === null, 'there was already a model' );
      this._model = this.createModel();
    },

    /**
     * Initialize the view.  Clients should use either this or initializeModelAndView
     * Clients may want to use this method to gain more control over the creation process
     * @public (joist-internal)
     */
    initializeView: function() {
      assert && assert( this._view === null, 'there was already a view' );
      this._view = this.createView( this.model );

      // Show the home screen's layoutBounds
      if ( phet.chipper.getQueryParameter( 'dev' ) ) {
        this._view.addChild( devCreateLayoutBoundsNode( this._view.layoutBounds ) );
      }

      // For debugging, make it possible to see the visibleBounds.  This is not included with ?dev since
      // it should just be equal to what you see.
      if ( phet.chipper.getQueryParameter( 'showVisibleBounds' ) ) {
        this._view.addChild( devCreateVisibleBoundsNode( this._view ) );
      }
    },

    // Initialize both the model and view
    initializeModelAndView: function() {
      this.initializeModel();
      this.initializeView();
    }
  }, {

    // @public
    HOME_SCREEN_ICON_SIZE: new Dimension2( 548, 373 ),

    // @public
    NAVBAR_ICON_SIZE: new Dimension2( 147, 100 )
  } );
} );