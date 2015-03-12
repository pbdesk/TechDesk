(function () {
    'use strict';

    angular
        .module('PBDesk.Logger')
        .controller('LoggerTestController', LoggerTestController);

    LoggerTestController.$inject = ['$scope', 'Logger'];

    function LoggerTestController($scope, Logger) {
    	$scope.title = 'Toastr';

    	$scope.pop = function () {
    		Logger.info('msg', 'ttl');
    	}
    }
        

        
    
})();
