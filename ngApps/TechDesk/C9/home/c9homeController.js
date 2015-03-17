(function () {
    'use strict';

    angular
        .module('PBDesk.TechDesk.App')
        .controller('c9homeController', c9homeController);

    c9homeController.$inject = ['$location', 'c9DataSvc'];

    function c9homeController($location, c9DataSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'c9homeController';

        activate();

        function activate() { }
    }
})();
