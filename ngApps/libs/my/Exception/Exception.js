(function() {
    'use strict';

    angular.module('PBDesk.Exception', ['PBDesk.Logger']);
})();

(function () {
    'use strict';

    angular
        .module('PBDesk.Exception')
        .factory('exception', exception);

    exception.$inject = ['Logger'];

    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function (reason) {
                logger.error(message, reason);
            };
        }
    }
})();
