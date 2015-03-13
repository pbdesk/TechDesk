(function () {
	'use strict';

	var coreApp = angular.module('PBDesk.TechDesk.Core', [
		'ngAnimate', 'ngSanitize', 'ngMaterial',
		'ngMdIcons',
		'angular-data.DSCacheFactory', 'angular-loading-bar', 'ui.router',
		 'PBDesk.Logger', 'PBDesk.Exception', 'PBDesk.GoogleFeedFetcher'
	]);
				   

	

  //  coreApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
  //  	cfpLoadingBarProvider.includeSpinner = true;
  //  	cfpLoadingBarProvider.includeBar = true;
  //}])

})();
