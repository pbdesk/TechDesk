(function(){
  'use strict';

    angular.module('PBDesk.TechDesk.App')
         .service('newsProviders', ['$q', newsProviders]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
    function newsProviders($q) {
    	var newSources = [
		  {
		  	name: 'CNET News',
		  	img: 'http://i.i.cbsi.com/cnwk.1d/i/ne/gr/prtnr/CNET_Logo_150.gif',
		  	itemCount: 20
		  },
		  {
		  	name: 'CNET News',
		  	img: 'https://pbs.twimg.com/profile_images/1860214036/Gizmodo-Twitter-Avatar_400x400.jpeg',
		  	itemCount: 20
		  },
		  {
		  	name: 'CNET News',
		  	img: 'https://pbs.twimg.com/profile_images/1860214036/Gizmodo-Twitter-Avatar_400x400.jpeg',
		  	itemCount: 20
		  },
		  {
		  	name: 'Lawrence Ray',
		  	avatar: 'svg-4',
		  	content: 'Scratch the furniture spit up on light gray carpet instead of adjacent linoleum so eat a plant, kill a hand pelt around the house and up and down stairs chasing phantoms run in circles, or claw drapes. Always hungry pelt around the house and up and down stairs chasing phantoms.'
		  },
		  {
		  	name: 'Ernesto Urbina',
		  	avatar: 'svg-5',
		  	content: 'Webtwo ipsum dolor sit amet, eskobo chumby doostang bebo. Bubbli greplin stypi prezi mzinga heroku wakoopa, shopify airbnb dogster dopplr gooru jumo, reddit plickers edmodo stypi zillow etsy.'
		  },
		  {
		  	name: 'Gani Ferrer',
		  	avatar: 'svg-6',
		  	content: "Lebowski ipsum yeah? What do you think happens when you get rad? You turn in your library card? Get a new driver's license? Stop being awesome? Dolor sit amet, consectetur adipiscing elit praesent ac magna justo pellentesque ac lectus. You don't go out and make a living dressed like that in the middle of a weekday. Quis elit blandit fringilla a ut turpis praesent felis ligula, malesuada suscipit malesuada."
		  }
    	];

    	// Promise-based API
    	return {
    		loadAll: function () {
    			// Simulate async nature of real remote calls
    			return $q.when(newSources);
    		}
    	};
    }

})();
