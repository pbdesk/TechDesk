(function () {
    'use strict';

    angular
        .module('PBDesk.TechDesk.App')
        .controller('homeController', homeController);

    homeController.$inject = ['$location', '$sce']; 

    function homeController($location, $sce) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'homeController';

        vm.videoConfig = {
            sources: [
                { src: $sce.trustAsResourceUrl("http://video.ch9.ms/ch9/2afd/ba2c6af2-75d8-4e32-a977-9c0383762afd/592IntroToAngularJSM06_high.mp4"), type: "video/mp4" },
                { src: $sce.trustAsResourceUrl("http://video.ch9.ms/ch9/2afd/ba2c6af2-75d8-4e32-a977-9c0383762afd/592IntroToAngularJSM06.webm"), type: "video/webm" }
                
            ],
            
            theme: "/ngApps/libs/3P/videogular/videogular.css",
            plugins: {
                poster: "http://video.ch9.ms/ch9/2afd/ba2c6af2-75d8-4e32-a977-9c0383762afd/592IntroToAngularJSM06_960.jpg"
            }
        };

        activate();

        function activate() { }
    }
})();
