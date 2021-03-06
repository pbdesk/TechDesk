﻿(function () {
	'use strict';

	var app = angular.module('PBDesk.TechDesk.App').config(configStates);

	configStates.$inject = ['$stateProvider', '$urlRouterProvider'];

	function configStates($stateProvider, $urlRouterProvider) {
		var viewPath = '/ngApps/TechDesk/';

		$stateProvider
			.state('Home', {
				url: '/',
				templateUrl: viewPath + "home/home.html",
				controller: 'homeController',
				controllerAs: 'vm'


			})
		.state('TechNews', {

			url: '/TechNews',
			templateUrl: viewPath + "TechNews/index.html"
			//controller: 'homeController',
			//controllerAs: 'vm'
		})
		.state('eLearning', {

			url: '/eLearning',
			templateUrl: viewPath + "eLearning/index.html"
			//controller: 'importController',
			//controllerAs: 'vm'
		})
		.state('demo', {

			url: '/demo',
			templateUrl: viewPath + "users/index.html",
			controller: 'UsersListController',
			controllerAs: 'ul'
		});

	}





})();
