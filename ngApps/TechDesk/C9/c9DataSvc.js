(function () {
    'use strict';

    angular
        .module('PBDesk.TechDesk.App')
        .factory('c9DataSvc', c9DataSvc);

    c9DataSvc.$inject = ['$http','$q'];

    function c9DataSvc($http, $q) {
    	var C9Data = {

    		featured: {
    			title: 'Latest on Channel9!',
    			url: 'http://channel9.msdn.com/',
    			imageUrl: '/ng/C9App/images/channel-9-logo.png',
    			rssUrl: 'http://channel9.msdn.com/Feeds/RSS',
    			itemCount: 20
    		},
    		shows: {
    			items: [
					{
						title: 'Windows Azure Friday',
						url: 'http://channel9.msdn.com/Shows/Windows-Azure-Friday',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/834a454f-52e2-47e0-9c5e-6f5d8732d43e.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Windows-Azure-Friday/RSS',
						tags: 'Azure',
						itemCount: 20
					},
					{
						title: 'Inside Windows Phone',
						url: 'http://channel9.msdn.com/Shows/Inside+Windows+Phone',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/ecda5d69-f848-465e-978d-51b7fb1be1a6.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Inside+Windows+Phone/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'TechNet Radio',
						url: 'http://channel9.msdn.com/Shows/TechNet+Radio',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/1f357399-7e4e-4b20-8e9e-51a1d676a856.png',
						rssUrl: 'http://channel9.msdn.com/Shows/TechNet+Radio/RSS',
						itemCount: 20
					},
					{
						title: 'The BizSpark Show',
						url: 'http://channel9.msdn.com/Shows/BizSpark',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/1d6a8bd4-e9b3-41ba-a689-b5d5d58dbf77.png',
						rssUrl: 'http://channel9.msdn.com/Shows/BizSpark/RSS',
						itemCount: 20
					},
					{
						title: 'Visual Studio Toolbox',
						url: 'http://channel9.msdn.com/Shows/Visual-Studio-Toolbox',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/dd06966e-c4db-4cb7-98f5-0771a57a97c1.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Visual-Studio-Toolbox/RSS',
						itemCount: 20
					},
					{
						title: 'C9::GoingNative',
						url: 'http://channel9.msdn.com/Shows/C9-GoingNative',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/b0b45cda-bf70-422a-9233-b414c8d055ad.png',
						rssUrl: 'http://channel9.msdn.com/Shows/C9-GoingNative/RSS',
						itemCount: 20
					},
					{
						title: 'Defrag Tools',
						url: 'http://channel9.msdn.com/Shows/Defrag-Tools',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/2d0efc90-384a-496c-83ff-bebd72197efe.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Defrag-Tools/RSS',
						itemCount: 20
					},
					{
						title: 'This Week On Channel 9',
						url: 'http://channel9.msdn.com/Shows/This+Week+On+Channel+9',
						imageUrl: 'http://ecn.channel9.msdn.com/o9/content/images/TWOC9_220x165.jpg',
						rssUrl: 'http://channel9.msdn.com/Shows/This+Week+On+Channel+9/RSS',
						itemCount: 20
					},
					{
						title: 'Ping!',
						url: 'http://channel9.msdn.com/Shows/PingShow',
						imageUrl: 'http://ecn.channel9.msdn.com/o9/content/areas/Ping_220x165.jpg',
						rssUrl: 'http://channel9.msdn.com/Shows/PingShow/RSS',
						itemCount: 20
					},
					{
						title: 'Web Camps TV',
						url: 'http://channel9.msdn.com/Shows/Web+Camps+TV',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/f4b95107-b27c-449d-84f1-4038028a0c1f.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Web+Camps+TV/RSS',
						itemCount: 20
					},
					{
						title: 'Windows Azure Cloud Cover Show',
						url: 'http://channel9.msdn.com/Shows/The-Defrag-Show',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a4e902b2-c5de-49a0-82ef-d7f5a7b960e8.png',
						rssUrl: 'http://channel9.msdn.com/Shows/The-Defrag-Show/RSS',
						itemCount: 20
					},
					{
						title: 'The Defrag Show',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/668139a6-8a4c-4ff0-8b4f-3f3cb9d9de5d.jpg',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					}

    			]

    		},

    		series: {
    			items: [
					{
						title: 'Developing Microsoft SharePoint Server 2013 Core Solutions',
						url: 'http://channel9.msdn.com/Series/Developing-SharePoint-2013-Core-Solutions',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/b8e0787f-6b24-4707-a7c0-d996ca29e22b.png',
						rssUrl: 'http://channel9.msdn.com/Series/Developing-SharePoint-2013-Core-Solutions/RSS',
						itemCount: 7

					},
					{
						title: 'Windows Server 2012 R2 Management and Automation',
						url: 'http://channel9.msdn.com/Series/WinSvr2012R2-Management-and-Automation',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/fcee9e57-73c1-4555-b6fe-4abdaad428b9.png',
						rssUrl: 'http://channel9.msdn.com/Series/WinSvr2012R2-Management-and-Automation/RSS',
						itemCount: 4
					},
					{
						title: 'Visual Studio Online',
						url: 'http://channel9.msdn.com/Series/Visual-Studio-Online',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/c34eac0e-0fbc-4238-8da5-fa7e25a48b8e.png',
						tags: 'Visual Studio, VS2013, VS Online',
						itemCount: 6
					},
					{
						title: 'Visual Studio Online "Monaco"',
						url: 'http://channel9.msdn.com/Series/Visual-Studio-Online-Monaco',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/221227df-8e85-4438-92f2-9581425c1a31.png',
						tags: 'Visual Studio, VS2013, VS, Visual Studio Online',
						itemCount: 9
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					},
					{
						title: 'Edge',
						url: 'http://channel9.msdn.com/Shows/Edge',
						imageUrl: 'http://files.channel9.msdn.com/thumbnail/a1a6deb8-1b5a-4ab2-a07a-b11e3b6fde99.png',
						rssUrl: 'http://channel9.msdn.com/Shows/Edge/RSS',
						itemCount: 20
					}
    			]
    		}
    	};

        var service = {
        	getShows: _getShows,
        	getSeries: _getSeries,
        	getRecent: _getRecent

        };

        return service;

        function _getShows() {
        	return $q.when(C9Data.shows)
        }

        function _getSeries() {
        	return $q.when(C9Data.series)
        }

        function _getFeatured() {
        	return $q.when(C9Data.featured)
        }
    }
})();