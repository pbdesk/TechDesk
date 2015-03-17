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



        var tabs = [
      { title: 'One', content: "Tabs will become paginated if there isn't enough room for them." },
      { title: 'Two', content: "You can swipe left and right on a mobile device to change tabs." },
      { title: 'Three', content: "You can bind the selected tab via the selected attribute on the md-tabs element." },
      { title: 'Four', content: "If you set the selected tab binding to -1, it will leave no tab selected." },
      { title: 'Five', content: "If you remove a tab, it will try to select a new one." },
      { title: 'Six', content: "There's an ink bar that follows the selected tab, you can turn it off if you want." },
      { title: 'Seven', content: "If you set ng-disabled on a tab, it becomes unselectable. If the currently selected tab becomes disabled, it will try to select the next tab." },
      { title: 'Eight', content: "If you look at the source, you're using tabs to look at a demo for tabs. Recursion!" },
      { title: 'Nine', content: "If you set md-theme=\"green\" on the md-tabs element, you'll get green tabs." },
      { title: 'Ten', content: "If you're still reading this, you should just go check out the API docs for tabs!" }
        ];
        vm.tabs = tabs;
        vm.selectedIndex = 2;



        activate();

        function activate() { }
    }
})();
