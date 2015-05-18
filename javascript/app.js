( function( $ ) {
	'use strict';

	var app = window.IntentDrivenInterface = {
		Models      : {},
		Collections : {},
		Views       : {},

		/**
		 * Initialization that runs as soon as this file has loaded
		 */
		start : function() {
			this.options       = idiOptions;
			this.mainContainer = $( '#idi-container' );
			this.searchField   = $( '#idi-search-field' );
			this.searchResults = $( '#idi-search-results' );
			idiOptions         = null;

			// todo change from this.options to app.options ?
			// todo can move try/catch to bootstrap?

			try {
				this.allLinks          = new app.Collections.Links( app.getAllLinks() );
				this.activeLinks       = new app.Collections.Links( [] );
				this.searchResultsView = new app.Views.Links( { el: app.searchResults, collection: this.activeLinks } );

				$( window ).keyup( app.toggleInterface );
				app.mainContainer.click( app.toggleInterface );
				app.searchField.keyup( app.showRelevantLinks );
				// todo maybe make this a controller that calls toggleinteface, showrelevantlinks, etc. better than having two listeners for same event?
			} catch ( exception ) {
				app.log( exception );
			}
		},

		/**
		 * Collect all the links on the page
		 *
		 * @returns {array}
		 */
		getAllLinks : function() {
			// todo stubbed

			var themes = new app.Models.Link( {
				'title' : 'Themes',
				'url'   : 'http://wp.dev/wp-admin/themes.php'
			} );

			var plugins = new app.Models.Link( {
				'title' : 'Plugins',
				'url'   : 'http://wp.dev/wp-admin/plugins.php'
			} );

			var dashboard = new app.Models.Link( {
				'title' : 'Dashboard',
				'url'   : 'http://wp.dev/wp-admin/index.php'
			} );

			return [ themes, plugins, dashboard ];
		},

		/**
		 * Reveal the interface when the user presses the shortcut
		 *
		 * @todo move to relevant view
		 *
		 * @param {object} event
		 */
		toggleInterface : function( event ) {
			if ( 'keyup' === event.type ) {
				if ( event.key === app.options.shortcuts.open ) {
					app.mainContainer.addClass( 'idi-active' );
					app.searchField.focus();
				} else if ( event.key === app.options.shortcuts.close ) {
					app.mainContainer.removeClass( 'idi-active' );
				}
			} else if ( 'click' === event.type ) {
				if ( 'notification-dialog-background' === event.target.className || 'media-modal-icon' === event.target.className ) {
					app.mainContainer.removeClass( 'idi-active' );
				}
			}
		},

		/**
		 * Show relevant links based on the user's query
		 *
		 * @todo move to relevant view
		 */
		showRelevantLinks : function() {
			$( '#idi-instructions' ).addClass( 'idi-active' );
			app.searchResults.addClass( 'idi-active' );

			app.activeLinks.reset( [ app.allLinks.pop() ] ); // todo find ones matching query
		},

		/**
		 * Log a message to the console
		 *
		 * @param {*} error
		 */
		log : function( error ) {
			if ( ! window.console ) {
				return;
			}

			if ( 'string' === typeof error ) {
				console.log( 'Intent-Driven Interface: ' + error );
			} else {
				console.log( 'Intent-Driven Interface: ', error );
			}
		}
	};
} )( jQuery );