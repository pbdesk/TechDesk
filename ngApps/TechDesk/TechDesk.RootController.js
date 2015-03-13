(function () {
    'use strict';

    angular
        .module('PBDesk.TechDesk.App')
        .controller('rootController', rootController);

    rootController.$inject = ['$location', '$mdSidenav'];

    function rootController($location, $mdSidenav) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'TechDesk';

        vm.toggleLeftMainSidebar = function () {
            $mdSidenav('leftMain').toggle();
        }

        activate();

        function activate() { }

        
    }
})();
