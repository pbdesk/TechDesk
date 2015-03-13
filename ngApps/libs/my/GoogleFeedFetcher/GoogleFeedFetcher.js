(function () {
    'use strict';

    angular.module('PBDesk.GoogleFeedFetcher', ['ngSanitize' ]);
})();


(function () {
    'use strict';

    angular
        .module('PBDesk.GoogleFeedFetcher')
        .factory('FeedsFactory', FeedsFactory);

    FeedsFactory.$inject = ['$q'];

    function FeedsFactory($q) {

        var apiUrl = 'http://ajax.googleapis.com/ajax/services/feed/load';
        var service = {
            GetFeeds: _getFeeds
        };

        return service;

        /*
        Feed Types
        ----------------------
        General Rss	5       rss
        Atoms	6           atoms
        ShortDesc NoImage	7
        ShortDesc WithImage	8
        SXP Format	10
        Channel 9	11      c9
        Media Rss	12
        ShortDesc WithImage Encl	13
        RTShortDesc With Img In MediaThumbnail	133
        RTShortDesc With Img In MediaContent	134
        RTShortDesc NoImg	135
        YouTube Playlist Rss	136     ut

        feed object format
        {
        title: '',
        desc: '',
        rssUrl: '',
        rssSiteUrl: '',
        pubDate: '',
        entries: []


        }

        entry:
        {
           title: ''
           desc: ''
           link: ''
           pubDate: ''
           contentSnippet: ''

        }
        */


        function _getFeeds(rssUrl, itemCount, feedType) {
            if (typeof (feedType) === 'undefined') feedType = 5; //General RSS
            if (typeof (itemCount) === 'undefined') itemCount = 10;
            if (!isFinite(itemCount)) itemCount = 10;

            var d = $q.defer();

            feedForamt = getFeedFormat(feedType);

            var apiParameters = {
                "v": "1.0",
                "q": rssUrl,
                "num": itemCount,
                "output": feedForamt
            }

            $http.get(apiUrl, { params: apiParameters })
            .success(function (data) {
                //$scope.rssTitle = data.responseData.feed.title;
                //$scope.rssUrl = data.responseData.feed.feedUrl;
                //$scope.rssSiteUrl = data.responseData.feed.link;
                //$scope.entries = data.responseData.feed.entries;
                d.resolve(data.responseData.feed);
            })
            .error(function (error) {
                d.reject(error);
            });

            return d.promise;


           
        }

        function getFeedFormat(feedType)
        {
            return 'json';
            /*
             * json_xml
             * xml
             */
        }

        //function getData(rssUrl, itemCount, feedType) {
        //    var d = $q.defer();


        //    var feed = new google.feeds.Feed(rssUrl);
        //    feed.setNumEntries(itemCount);
        //    feed.setResultFormat(google.feeds.Feed.MIXED_FORMAT);
        //    feed.includeHistoricalEntries();
        //    feed.load(function (result) {
        //        if (!result.error) {
        //            switch (feedType.toString().toLowerCase()) {
        //                case 'c9':
        //                case '11': {
        //                    ResolveC9RssMedia(result);
        //                    break;
        //                }
        //                case 'ut': {
        //                    ResolveYouTubePlaylistRss(result);
        //                    break;
        //                }
        //                case '135': {
        //                    //RTShortDesc NoImg
        //                    ResolveGoogleNewsFeeds(result);
        //                    break;
        //                }
        //                case '134': {
        //                    ResolveYahooNewsFeeds(result);
        //                    break;
        //                }
        //                case '133': {
        //                    ResolveCNETNewsFeeds(result);
        //                    break;
        //                }
        //                case '10': {
        //                    ResolveSXPFeeds(result);
        //                    break;
        //                }
        //                default: {
        //                    ResolveDefaultRss(result)
        //                    break;
        //                }
        //            }
        //            d.resolve(result);

        //            //if (feedType === 'c9' || feedType == 11) {
        //            //    ResolveC9RssMedia(result);
        //            //}
        //            //else if (feedType === 'ut') {
        //            //    ResolveYouTubePlaylistRss(result);
        //            //}

        //        }
        //        else {
        //            d.reject(result.error);
        //        }
        //    });
        //    return d.promise;
        //}

        //function ResolveYouTubePlaylistRss(result) {


        //    for (var i in result.feed.entries) {


        //        jQuery(result.feed.entries[i].xmlNode).find("media\\:thumbnail, thumbnail").each(
        //            function () {
        //                var current = jQuery(this);
        //                if (result.feed.entries[i].Thumbnail1 == null && current.attr("width") == "480") {
        //                    result.feed.entries[i].Thumbnail1 = current.attr("url");
        //                }
        //                else if (result.feed.entries[i].Thumbnail2 == null && current.attr("width") == "120") {
        //                    result.feed.entries[i].Thumbnail2 = current.attr("url");
        //                }
        //            });

        //        var link = result.feed.entries[i].link;
        //        var start = link.indexOf('?v=') + 3;
        //        var end = link.indexOf('&', start);
        //        var code = link.substring(start, end);
        //        result.feed.entries[i].VideoCode = code;





        //        result.feed.entries[i].pubDate = result.feed.entries[i].publishedDate.substring(0, 16);
        //    }


        //}

        //function ResolveC9RssMedia(result) {


        //    for (var i in result.feed.entries) {


        //        jQuery(result.feed.entries[i].xmlNode).find("media\\:thumbnail, thumbnail").each(
        //            function () {
        //                var current = jQuery(this);
        //                if (current.attr("width") == "100") result.feed.entries[i].Thumbnail1 = current.attr("url");
        //                if (current.attr("width") == "220") result.feed.entries[i].Thumbnail2 = current.attr("url");
        //                if (current.attr("width") == "512") result.feed.entries[i].Thumbnail3 = current.attr("url");
        //            });




        //        try {


        //            for (var j in result.feed.entries[i].mediaGroups[0].contents) {
        //                var media = result.feed.entries[i].mediaGroups[0].contents[j];
        //                switch (media.type) {
        //                    case "audio/mp3": result.feed.entries[i].mp3 = media.url; break;
        //                    case "video/webm": result.feed.entries[i].webm = media.url; break;
        //                    case "video/mp4":
        //                        if (media.url.indexOf("_high.") > 0) result.feed.entries[i].mp4high = media.url;
        //                        else if (media.url.indexOf("_mid.") > 0) result.feed.entries[i].mp4mid = media.url;
        //                        else result.feed.entries[i].mp4reg = media.url;
        //                        break;
        //                }
        //            }


        //        }
        //        catch (err) {
        //            continue;
        //        }
        //        if (typeof (result.feed.entries[i].Thumbnail1) == "undefined") result.feed.entries[i].Thumbnail1 = "";
        //        if (typeof (result.feed.entries[i].Thumbnail2) == "undefined") result.feed.entries[i].Thumbnail2 = "";
        //        if (typeof (result.feed.entries[i].Thumbnail3) == "undefined") result.feed.entries[i].Thumbnail3 = "";
        //        if (typeof (result.feed.entries[i].webm) == "undefined") result.feed.entries[i].webm = "";
        //        if (typeof (result.feed.entries[i].mp3) == "undefined") result.feed.entries[i].mp3 = "";


        //        if (typeof (result.feed.entries[i].mp4high) != "undefined")
        //            result.feed.entries[i].mp4 = result.feed.entries[i].mp4high;
        //        else if (typeof (result.feed.entries[i].mp4mid) != "undefined")
        //            result.feed.entries[i].mp4 = result.feed.entries[i].mp4mid;
        //        else if (typeof (result.feed.entries[i].mp4reg) != "undefined")
        //            result.feed.entries[i].mp4 = result.feed.entries[i].mp4reg;
        //        else
        //            result.feed.entries[i].mp4 = "";


        //        result.feed.entries[i].pubDate = result.feed.entries[i].publishedDate.substring(0, 16);
        //    }


        //}

        //function ResolveGoogleNewsFeeds(result) {
        //    //RTShortDesc NoImg   - 135
        //    for (var i in result.feed.entries) {
        //        result.feed.entries[i].matter = result.feed.entries[i].content;
        //    }
        //}

        //function ResolveYahooNewsFeeds(result) {
        //    //RTShortDesc With Img In MediaContent	134
        //    for (var i in result.feed.entries) {
        //        result.feed.entries[i].matter = result.feed.entries[i].content;

        //        jQuery(result.feed.entries[i].xmlNode).find("media\\:content, content").each(
        //            function () {
        //                var current = jQuery(this);
        //                var typ = current.attr("type");
        //                if (typ && typ.length > 0) {
        //                    typ = typ.toLowerCase();
        //                    if (typ.indexOf('image/') == 0) {
        //                        result.feed.entries[i].Thumbnail = current.attr("url");
        //                    }
        //                }
        //                else {
        //                    result.feed.entries[i].Thumbnail = '';
        //                }
        //            });

        //    }
        //}

        //function ResolveCNETNewsFeeds(result) {
        //    //RTShortDesc With Img In Media/Thumbnail	133  
        //    //CNET
        //    for (var i in result.feed.entries) {
        //        result.feed.entries[i].matter = result.feed.entries[i].contentSnippet;

        //        jQuery(result.feed.entries[i].xmlNode).find("media\\:thumbnail, thumbnail").each(
        //            function () {
        //                var current = jQuery(this);
        //                var url = current.attr("url");
        //                if (url && url.length > 0) {
        //                    result.feed.entries[i].Thumbnail = url;
        //                }
        //                else {
        //                    result.feed.entries[i].Thumbnail = '';
        //                }
        //            });

        //    }
        //}

        //function ResolveSXPFeeds(result) {
        //    //SXP Format	10  
        //    //CNET
        //    for (var i in result.feed.entries) {
        //        result.feed.entries[i].matter = result.feed.entries[i].contentSnippet;

        //        jQuery(result.feed.entries[i].xmlNode).find("enclosure").each(
        //            function () {
        //                var current = jQuery(this);
        //                var url = current.attr("url");
        //                if (url && url.length > 0) {
        //                    result.feed.entries[i].Thumbnail = url;
        //                }
        //                else {
        //                    result.feed.entries[i].Thumbnail = '';
        //                }
        //            });

        //    }
        //}

        //function ResolveDefaultRss(result) {
        //    for (var i in result.feed.entries) {
        //        result.feed.entries[i].matter = result.feed.entries[i].contentSnippet;
        //    }
        //}
    }
})();