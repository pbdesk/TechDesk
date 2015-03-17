(function () {
	'use strict';

	var coreApp = angular.module('PBDesk.TechDesk.Core', [
		'ngAnimate', 'ngSanitize', 'ngMaterial',
		'ngMdIcons',
		'angular-data.DSCacheFactory', 'angular-loading-bar', 'ui.router',
		 'PBDesk.Logger', 'PBDesk.Exception', 'PBDesk.GoogleFeedFetcher',
			"com.2fdevs.videogular",
			"com.2fdevs.videogular.plugins.controls",
			"com.2fdevs.videogular.plugins.overlayplay",
			"com.2fdevs.videogular.plugins.poster",
			"com.2fdevs.videogular.plugins.buffering"
	]);
				   

	

  //  coreApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
  //  	cfpLoadingBarProvider.includeSpinner = true;
  //  	cfpLoadingBarProvider.includeBar = true;
  //}])

})();
