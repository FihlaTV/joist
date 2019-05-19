// Copyright 2019, University of Colorado Boulder

/**
 * Monitors the activity as it relates to time spent on each screen of a sim. Mainly this is to provide this information
 * to a PhET-iO wrapper frame.
 *
 * The main output of this file is powered by the data stream. As a result the finest granularity of this data is based on
 * the most frequent events that are emitting. As of this writing, when emitting high frequency events, that is every
 * frame on the "stepSimulation" event. Note that if not emitting high frequency events, this Type's live activity
 * (how often the data is updated) won't be nearly as accurate.
 *
 * NOTE: for totalSecondsActive, this is not based on an interval running every second, but instead based on the data
 * stream events. As a result this metric will count "one second of activity" in the following way. An active second
 * begins when an "active event" (see ActivityMonitor.isActiveEvent) is emitted to the data stream. Then the next
 * second of time will be counted as "active" and other active events within that time will not change the output.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const joist = require( 'JOIST/joist' );
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );

  // ifphetio
  const dataStream = require( 'ifphetio!PHET_IO/dataStream' );

  class ActivityMonitor {

    /**
     * @param {Sim} sim
     */
    constructor( sim ) {
      const screens = sim.screens;

      // TODO: handle data for each screen, https://github.com/phetsims/joist/issues/553
      this.engagementMetrics = {
        sim: {
          startOfData: null, // the timestamp of the first time the sim is active with
          currentTimeStamp: null, // current time of the sim
          totalSecondsOfSimRun: 0, // number of seconds since startOfData
          totalSecondsActive: 0 // number of seconds in which "activity" occurred, see above doc "NOTE" for more.
        },
        screens: []
      };
      screens.forEach( screen => {
        this.engagementMetrics.screens.push( {
          tandemName: screen.screenTandem.tail,
          timeStampOfFirstUse: null,
          timeStampOfLastUse: null,
          totalSecondsOfScreenRun: 0,
          totalSecondsActive: 0
        } );
      } );

      assert && assert( dataStream, 'cannot add dataStream listener because dataStream is not defined' );

      // Set to true once the sim has had its first active event, false until then. This is used to set startOfData
      let firstActive = false;

      // {null|number} - keep track of when the second of activity began, null if the second isn't currently active
      let activeSecondStartTime = null;

      // Initial values for sim properties, updated in the event listener callback
      let isHomeScreenShowing = sim.showHomeScreenProperty.value;
      let currentScreenIndex = sim.screenIndexProperty.value;

      dataStream.addAllEventListener( ( event, rootEvent ) => {

        const updateScreenStartTime = () => {
          if ( !isHomeScreenShowing ) {
            const screenElement = this.engagementMetrics.screens[ currentScreenIndex ];
            screenElement.timeStampOfFirstUse = screenElement.timeStampOfFirstUse || event.time;
          }
        };

        // Read values for screen changes through data stream so everything is ordered and synchronized
        if ( event.phetioID === sim.showHomeScreenProperty.tandem.phetioID &&
             event.name === Property.CHANGED_EVENT_NAME ) {
          isHomeScreenShowing = event.data.newValue;
          updateScreenStartTime();
        }

        if ( event.phetioID === sim.screenIndexProperty.tandem.phetioID &&
             event.name === Property.CHANGED_EVENT_NAME ) {
          currentScreenIndex = event.data.newValue;
          updateScreenStartTime();
        }

        const currentScreenEntry = this.engagementMetrics.screens[ currentScreenIndex ];
        if ( activeSecondStartTime !== null && event.time - activeSecondStartTime > 1000 ) {

          // Increment the total sim time
          this.engagementMetrics.sim.totalSecondsActive += 1;

          // Increment the time on the current screen (if home screen not showing)
          if ( !isHomeScreenShowing ) {
            currentScreenEntry.totalSecondsActive += 1;
          }
          activeSecondStartTime = null;
        }
        if ( this.isActiveEvent( event ) ) {

          // First active event
          if ( !firstActive ) {
            firstActive = true;
            this.engagementMetrics.sim.startOfData = event.time;
          }
          // Set the start time if not currently in an active second, otherwise don't override the initial start
          if ( activeSecondStartTime === null ) {
            activeSecondStartTime = event.time;
          }
        }

        this.engagementMetrics.sim.currentTimeStamp = event.time;
        const startTime = this.engagementMetrics.sim.startOfData || event.time;
        const msDifference = event.time - startTime;
        this.engagementMetrics.sim.totalSecondsOfSimRun = Util.toFixedNumber( msDifference / 1000, 0 );


        if ( !isHomeScreenShowing && event.phetioID === sim.stepSimulationAction.tandem.phetioID ) {
          currentScreenEntry.totalSecondsOfScreenRun += event.data.dt;
        }
      } );
    }

    /**
     * Returns true if the event signifies that the student is "active." The current definition is just pointer down
     * events.
     * @private
     * @param {Object} event - an event from the data stream
     * @returns {boolean}
     */
    isActiveEvent( event ) {
      let isActiveEvent = false;
      [ 'mouseDownAction', 'touchDownAction', 'keydownAction', 'penDownAction' ].forEach( eventName => {
        if ( phetio.PhetioIDUtils.getComponentName( event.phetioID ) === eventName ) {
          isActiveEvent = true;
        }
      } );
      return isActiveEvent;
    }

    /**
     * get the current activity data of the simulation.
     * @public
     * @returns {Object}
     */
    getActivity() {
      return this.engagementMetrics;
    }
  }

  return joist.register( 'ActivityMonitor', ActivityMonitor );
} );