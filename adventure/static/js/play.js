function loadYTPlayer(videoID) {
    nextVideo = videoID;
    var params = { allowScriptAccess: "always" };
    var atts = { id: "ytplayer" };
    // must have a video id, otherwise an error is raised and onYouTubePlayerReady is never called
    swfobject.embedSWF("http://www.youtube.com/v/{0}?enablejsapi=1&playerapiid=ytplayer&version=3".format(videoID),
            "ytplayer", "640", "385", "8", null, null, params, atts);
}

var ytplayer;

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("ytplayer");
    ytplayer.addEventListener("onStateChange", "playerStateChangeListener");
    watch(nextVideo);
}

function playerStateChangeListener(event) {
    if(event == 0) {
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
        ytplayer.loadVideoById(videoID);

        var relatedURL = "https://gdata.youtube.com/feeds/api/videos/{0}/related".format(videoID);
        oldRelated.push(related); // append the previous related list to the oldRelated list
        getRelated(relatedURL);
    }
}

// Doesn't return anything yet; need to decide what we want.
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
        nextVideo = related[Math.floor(Math.random() * related.length)];
    });
}
