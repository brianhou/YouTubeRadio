// Reading the JSON output for search results and noting possibly useful things:
//     val.link[4].href is the related videos feed
//     val.gd$rating.average is the score from 1 to 5
//     val.media$group.yt$videoid is the video id

var watchHistory = [];
var related = [];
var oldRelated = [];

// Eventually should reduce stupid suggestions (like exact same video, duplicate music videos, and...?)
// Check that new video IDs are not in watchHistory
// A naive way to fix the second would be to check for different titles; not sure how much we can go beyond that.

// Placeholder
function watch(videoID) {
    watchHistory.push(videoID);
    // playVideo(videoID)
    var relatedURL = "https://gdata.youtube.com/feeds/api/videos/" + videoID + "/related"
    // I think the scope is okay here, but I'll double check later
    oldRelated = related;
    related = getRelated(relatedURL);
}

// Doesn't return anything yet; need to decide what we want.
function getRelated(relatedVideosURL) {
    var data = {"alt":"json", "v":"2", "key":DEVKEY, "format":"5"};
    $.getJSON(relatedVideosURL, data, function (data) {
	$.each(data.feed.entry, function (key, val) {
	    // val.author[0].name.$t is the uploader
	    // val.content.src is the SWF thing
	    // val.gd$rating.average is the score from 1 to 5
	    // val.link[2].href is the related videos feed of the related video (Yes, this is different from the related videos feed of the original video)
	    // val.media$group.media$thumbnail[1].url is the thumbnail
	    // val.media$group.yt$duration
	    // val.media$group.yt$videoid
	    // val.title.$t
	    // val.yt$statistics.viewCount
	    // val.yt$rating.numDislikes and val.yt$rating.numLikes
	});
    });
}

