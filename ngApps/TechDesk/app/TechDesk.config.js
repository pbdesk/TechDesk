(function () {
	'use strict';

	var app = angular.module('PBDesk.TechDesk.App');


	app.constant('AppSettings', {
		//
		
	});

	app.config(function($mdThemingProvider, $mdIconProvider){

		$mdIconProvider
			.defaultIconSet("./assets/svg/avatars.svg", 128)
			.icon("menu"       , "./assets/svg/menu.svg"        , 24)
			.icon("share"      , "./assets/svg/share.svg"       , 24)
			.icon("google_plus", "./assets/svg/google_plus.svg" , 512)
			.icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
			.icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
			.icon("phone"      , "./assets/svg/phone.svg"       , 512);

		$mdThemingProvider.theme('default')
			.primaryPalette('blue')
			.accentPalette('orange');

	});

	app.constant('MainMenuItems', {
		SideMenuItems: [
			{ text: 'Home', icon: 'home', state:'Home' },
			{ text: 'TechNews', icon: 'info', state: 'TechNews' },
			{ text: 'eLearning', icon: 'laptop', state: 'eLearning' },
			{ text: 'Channel9', icon: 'laptop', state: 'Channel9' }
		]

	});



})();
