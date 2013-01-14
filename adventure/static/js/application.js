var suggestCallBack; // global var for autocomplete jsonp

$(document).ready(function () {

    // If there's already a video id in the url, play that
    if(document.location.hash) {
        $("#play").fadeIn();
        loadYTPlayer(document.location.hash.slice(1));
    } else {
        $("#intro").fadeIn();
        $("#search").show();
    }

    // Initialize button and "instant" function
    $("#search_button").click(ytsearch);
    $("#search_query").keyup(ytsearch);

    // Initialize autocomplete for search terms
    $("#search_query").autocomplete({
        source: function(request, response) {
            $.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
                {
                  "hl":"en", // Language
                  "ds":"yt", // Restrict lookup to youtube
                  "jsonp":"suggestCallBack", // jsonp callback function name
                  "q":request.term, // query term
                  "client":"youtube" // force youtube style response, ie json
                });
            suggestCallBack = function (data) {
                var suggestions = [];
                $.each(data[1], function(key, val) {
                    suggestions.push({"value":val[0]});
                });
                suggestions.length = 5;
                response(suggestions);
            };
        }
    });

    $("#shareLink").click(function() {
        this.select();
    });
});


var DEVKEY = 'AI39si5Qhb1zpJVCuudxeWSmOEI-9cDE2Cpk457J71XODD0pX6Buq3Hznh5ndANY9BHzuZ-fmtcnrbfTgBYgH1QvNuU7_ZeoYQ';

function ytsearch(event) {
    event.preventDefault();
    var query = $("#search_query").val();
    if (query) {
        $("#play").fadeOut();
        $("#intro").fadeIn();

        // Use YouTube API to fetch search results
        var url = "https://gdata.youtube.com/feeds/api/videos";
        var data = {"q":query, "alt":"json", "max-results":"5", "v":"2", "orderby":"relevance", "key":DEVKEY, "format":"5"};
        $.getJSON(url, data, function (data) {
            // holds formatted search results
            var items = [];
            $.each(data.feed.entry, function (key, val) {
                // construct the div for each search result
                var html = "<div class=\"result\">" +
                            "<img class= \"img-rounded left\" src=\"{1}\"/>" +
                            "<b><a href=\"javascript:selectVideo(\'{0}\')\"><span></span>{2}</a></b><br>" +
                            "by {3}<br>" +
                            "{4} | {5} views" +
                            "<div class=\"clear\"></div></div>";
                items.push(html.format(
                            val.media$group.yt$videoid.$t,
                            val.media$group.media$thumbnail[1].url,
                            val.title.$t,
                            val.author[0].name.$t,
                            secondsToHMS(val.media$group.yt$duration.seconds),
                            numAddCommas(val.yt$statistics.viewCount)));
            });
            // Insert the search results and set their click listener
            $("#search_results").html(items.join(""));

            $("#search").fadeIn();
        });
    }
}

function selectVideo(videoID) {
    $("#search").fadeOut();
    $("#intro").fadeOut();
    $("#play").fadeIn();
    if (ytplayer) {
        watch(videoID);
    } else {
        loadYTPlayer(videoID);
    }

}

var ytplayer;
function loadYTPlayer(videoID) {
    nextVideo = videoID;
    var params = { allowScriptAccess: "always" };
    var atts = { id: "ytplayer" };
    // must have a video id, otherwise an error is raised and onYouTubePlayerReady is never called
    swfobject.embedSWF("http://www.youtube.com/v/{0}?enablejsapi=1&playerapiid=ytplayer&version=3".format(videoID),
            "ytplayer", "640", "385", "8", null, null, params, atts);
}

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("ytplayer");
    ytplayer.addEventListener("onStateChange", "playerStateChangeListener");
    watch(nextVideo);
}

function playerStateChangeListener(event) {
    if(event === 0) {
        watch(nextVideo);
    }
}

var nextVideo;
var watchHistory = [];
var related = [];
var oldRelated = [];

// Eventually should reduce stupid suggestions (like exact same video, duplicate music videos, and...?)
// Check that new video IDs are not in watchHistory
// A naive way to fix the second would be to check for different titles; not sure how much we can go beyond that.

function watch(videoID) {
    if (ytplayer) {
        document.location.hash = videoID;
        watchHistory.push(videoID);
        $("#shareLink").val(document.location.href);
        ytplayer.loadVideoById(videoID);

        var relatedURL = "https://gdata.youtube.com/feeds/api/videos/{0}/related".format(videoID);
        oldRelated.push(related); // append the previous related list to the oldRelated list
        getRelated(relatedURL);
    }
}

function getRelated(relatedVideosURL) {
    related.length = 0;
    var data = {"alt":"json", "v":"2", "key":DEVKEY, "format":"5"};
    $.getJSON(relatedVideosURL, data, function (data) {
        $.each(data.feed.entry, function (key, val) {
            var id = val.media$group.yt$videoid.$t;
            if (!(id in watchHistory)) {
                related.push(id);
            }
            // val.author[0].name.$t is the uploader
            // val.gd$rating.average is the score from 1 to 5
            // val.link[2].href is the related videos feed of the related video (Yes, this is different from the related videos feed of the original video)
            // val.media$group.media$thumbnail[1].url is the thumbnail
            // val.media$group.yt$duration
            // val.media$group.yt$videoid
            // val.title.$t
            // val.yt$statistics.viewCount
            // val.yt$rating.numDislikes and val.yt$rating.numLikes
        });
        nextVideo = related.splice(Math.floor(Math.random() * related.length), 1)[0]; //Splice a random item off the list and designate as the next video
    });
}

/* Utility Functions */

String.prototype.format = function() {
    var formatted = this;
    for (var i=0; i < arguments.length; i++) {
    	var regexp = new RegExp('\\{'+i+'\\}', 'g');
    	formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function secondsToHMS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), s = d % 60;
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
};

function numAddCommas(n) {
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(n)) {
        n = n.replace(rgx, '$1' + ',' + '$2');
    }
    return n;
};
