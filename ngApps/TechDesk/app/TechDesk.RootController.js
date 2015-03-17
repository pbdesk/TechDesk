(function () {
    'use strict';

    angular
        .module('PBDesk.TechDesk.App')
        .controller('rootController', rootController);

    rootController.$inject = ['$location', '$mdSidenav', 'MainMenuItems'];

    function rootController($location, $mdSidenav, MainMenuItems) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'TechDesk';

        vm.mainSideMenuItems = MainMenuItems.SideMenuItems;

        vm.toggleLeftMainSidebar = function () {
            $mdSidenav('leftMain').toggle();
        }

        activate();

        function activate() { }

        
    }
})();
