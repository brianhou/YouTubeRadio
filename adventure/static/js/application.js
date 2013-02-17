var suggestCallBack; // global var for autocomplete jsonp

$(document).ready(function () {

    // If there's already a video id in the url, play that
    if(document.location.hash) {
        $("#play").show();
        var videoID = document.location.hash.slice(1);
        var url = "https://gdata.youtube.com/feeds/api/videos/{0}".format(videoID);
        var data = {"alt":"json", "v":"2", "key":DEVKEY};
        $.getJSON(url, data, function (data) {
            var vid = { "id" : data.entry.media$group.yt$videoid.$t,
                        "thumbnail" : data.entry.media$group.media$thumbnail[1].url,
                        "title" : data.entry.title.$t,
                        "uploader" : data.entry.author[0].name.$t,
                        "length" : secondsToHMS(data.entry.media$group.yt$duration.seconds),
                        "views" : numAddCommas(data.entry.yt$statistics.viewCount)};
            loadYTPlayer(vid);
        });
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
                {"hl":"en", // Language
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
                if(suggestions.length > 5) {
                    suggestions.length = 5;
                }
                response(suggestions);
            };
        },
        minLength: 2,

    });

    $("#shareLink").click(function() {
        this.select();
    });
});


var DEVKEY = 'AI39si5Qhb1zpJVCuudxeWSmOEI-9cDE2Cpk457J71XODD0pX6Buq3Hznh5ndANY9BHzuZ-fmtcnrbfTgBYgH1QvNuU7_ZeoYQ';

var searchResults = {};

function ytsearch(event) {
    event.preventDefault();
    var query = $("#search_query").val();
    if (query) {
        // Make sure player is hidden away.
        $("#play").fadeOut();
<<<<<<< HEAD
        $("#intro").fadeIn();
=======
        $("#slider").fadeOut();
        $("#slider-text").fadeOut();
        // Remove the intro text
        $("#intro").fadeOut();
>>>>>>> aabd6ee8c7296c3879b40b5bf4b44e4d5f7646ff

        // Use YouTube API to fetch search results
        var url = "https://gdata.youtube.com/feeds/api/videos";
        var data = {"q":query, "alt":"json", "max-results":"10", "v":"2", "orderby":"relevance", "key":DEVKEY, "format":"5"};
        $.getJSON(url, data, function (data) {
            // holds formatted search results
            var items = [];
            $.each(data.feed.entry, function (key, val) {
                try {
                    var videoID = val.media$group.yt$videoid.$t;
                    var video = { "id" : videoID,
                                  "thumbnail" : val.media$group.media$thumbnail[1].url,
                                  "title" : val.title.$t,
                                  "uploader" : val.author[0].name.$t,
                                  "length" : secondsToHMS(val.media$group.yt$duration.seconds),
                                  "views" : numAddCommas(val.yt$statistics.viewCount)};
                    searchResults[videoID] = video;
                    // construct the div for each search result
                    var html = "<div class=\"result\">" +
                                "<img class= \"img-rounded left\" src=\"{1}\"/>" +
                                "<b><a class=\"extendedLink\" href=\"javascript:selectVideo(\'{0}\')\"><span></span>{2}</a></b><br>" +
                                "by {3}<br>" +
                                "{4} | {5} views" +
                                "<div class=\"clear\"></div></div>";
                    items.push(html.format(
                                videoID,
                                video["thumbnail"],
                                video["title"],
                                video["uploader"],
                                video["length"],
                                video["views"]));
                } catch (e) {
                    return "continue"; // skip to next result item
                }
            });
            // Insert the search results and set their click listener
            $("#search_results").html(items.join(""));

            $("#search").fadeIn();
        });
    }
}

function selectVideo(videoID) {
    $("#search").fadeOut();
    $("#play").show();
    loadYTPlayer(searchResults[videoID]);
}

var ytplayer;
var nextVideo;
var numVideos;
var watchHistory = [];
var related = [];
var blacklist = {}; // use a dictionary like a set to remove duplicates
var relatedSublist = [];

$(function() {
    $("#slider").slider({
        value: 10,
        min: 1,
        max: 25,
        step: 1,
        slide: function(event, ui) {
            $("#adventure-type").val(ui.value);
        }
    });
    $("#adventure-type").val($("#slider").slider("value"));
});

function loadYTPlayer(video) {
    nextVideo = video;
    var params = { allowScriptAccess: "always", allowFullScreen: true };
    var atts = { id: "ytplayer" };
    // must have a video id, otherwise an error is raised and onYouTubePlayerReady is never called
    swfobject.embedSWF("http://www.youtube.com/v/{0}?enablejsapi=1&playerapiid=ytplayer&version=3".format(video["id"]),
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

// Eventually should reduce stupid suggestions (like exact same video, duplicate music videos, and...?)
// Check that new video IDs are not in watchHistory
// A naive way to fix the second would be to check for different titles; not sure how much we can go beyond that.

function watch(video) {
    // Set the hash and share url
    document.location.hash = video["id"];
    updateHistory(video);
    $("#shareLink").val(document.location.href);

    var html = "<b>{0}</b><br>by {1}<br>{2} | {3} views";
    $("#videoInfo").html(html.format(video["title"], video["uploader"], video["length"], video["views"]));

    // Load (and play) the video
    ytplayer.loadVideoById(video["id"]);

    // Setup for the next video
    getRelated(video["id"]);
}

function watchHistoricVideo(videoID) {
    $.each(watchHistory, function(key, val) {
        if (val["id"] === videoID) {
            watch(val);
            return false;
        }
    });
}

function updateHistory(video) {
    blacklist[video["id"]] = true;
    watchHistory.push(video);
    var html = "<div class=\"history\">" +
               "<img class= \"img-rounded\" src=\"{0}\"/>" +
               "<p><b><a class=\"extendedLink\" href=\"javascript:watchHistoricVideo(\'{1}\');\"><span></span>{2}</a></b><br>" +
               "by {3}<br>" +
               "{4} | {5} views</p>" +
               "</div>";

    $("#watchHistory").prepend(html.format(video["thumbnail"],
                                           video["id"],
                                           video["title"],
                                           video["uploader"],
                                           video["length"],
                                           video["views"]));
}

function getRelated(videoID) {
    numVideos = $("#slider").slider("value");
    var relatedURL = "https://gdata.youtube.com/feeds/api/videos/{0}/related".format(videoID);

    // Clear the related list
    related.length = 0;

    // Get the related video stream
    var data = {"alt":"json", "v":"2", "key":DEVKEY, "format":"5"};
    $.getJSON(relatedURL, data, function (data) {
        $.each(data.feed.entry, function (key, val) {
            var video = { "id" : val.media$group.yt$videoid.$t,
                          "thumbnail" : val.media$group.media$thumbnail[1].url,
                          "title" : val.title.$t,
                          "uploader" : val.author[0].name.$t,
                          "length" : secondsToHMS(val.media$group.yt$duration.seconds),
                          "views" : numAddCommas(val.yt$statistics.viewCount)};
            if (! (video["id"] in blacklist)) {
                related.push(video);
            }
            // val.gd$rating.average is the score from 1 to 5
            // val.link[2].href is the related videos feed of the related video (Yes, this is different from the related videos feed of the original video)
            // val.yt$rating.numDislikes and val.yt$rating.numLikes
        });
        relatedSublist = related.slice(0);
        relatedSublist.splice(numVideos);
        selectNextVideo();
    });
}

function selectNextVideo() {
    if (related.length > numVideos || relatedSublist.length > 0) {
        // Select the next video
        // nextVideo = related.splice(Math.floor(Math.random() * related.length), 1)[0];
        // Splice a random item off the list and designate as the next video
        // Videos are ordered by relevance, so maybe selecting the first instead of a random will give better results.
        blacklist[nextVideo["id"]] = true;
        if (relatedSublist.length > 0) {
            nextVideo = relatedSublist.splice(Math.floor(Math.random() * relatedSublist.length), 1)[0];
        } else {
            nextVideo = related.splice(numVideos, 1)[0];
        }
        var html = "<img class= \"img-rounded\" src=\"{0}\"/>" +
                   "<p><b>{1}</b><br>" +
                   "by {2}<br>" +
                   "{3} | {4} views</p>" +
                   "<div class=\"clear\"></div>";
        $("#upNext").html(html.format(nextVideo["thumbnail"],
                    nextVideo["title"],
                    nextVideo["uploader"],
                    nextVideo["length"],
                    nextVideo["views"]));
    } else {
        alert("Oops! We ran out of suggested videos. Stick with the current one, or pick a new one to continue your adventure.");
    }
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
}

function numAddCommas(n) {
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(n)) {
        n = n.replace(rgx, '$1' + ',' + '$2');
    }
    return n;
}
