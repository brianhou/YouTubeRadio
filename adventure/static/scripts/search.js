$(document).ready(function () {
    // Initialize search button function
    $("#search_button").click(ytsearch);
    // Initialize "instant" search function
    $("#search_query").keyup(ytsearch);
    //$("#player").css("display", "inline");
});

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

var DEVKEY = 'AI39si5Qhb1zpJVCuudxeWSmOEI-9cDE2Cpk457J71XODD0pX6Buq3Hznh5ndANY9BHzuZ-fmtcnrbfTgBYgH1QvNuU7_ZeoYQ'

function ytsearch(keyword) {
    var query = $("#search_query").val();
    if (query) {
        var url = "https://gdata.youtube.com/feeds/api/videos";
        var data = {"q":query, "alt":"json", "max-results":"5", "v":"2", "orderby":"relevance", "key":DEVKEY, "format":"5"};
        $.getJSON(url, data, function (data) {
            var items = [];
            $.each(data.feed.entry, function (key, val) {
                var html = "<div class=\"result\">" +
                			"<img src=\"{1}\"/>" +
                			"<div><b><a href=\"{0}\"><span></span>{2}</a></b><br>" +
                			"by {3}<br>" +
                			"{4} | {5} views</div>" +
                			"<div class=\"clear\"></div></div>";
            	items.push(html.format(
						    val.content.src,
						    val.media$group.media$thumbnail[1].url,
						    val.title.$t,
						    val.author[0].name.$t,
						    secondsToHMS(val.media$group.yt$duration.seconds),
						    numAddCommas(val.yt$statistics.viewCount))
            	);
            });
            $("#search_results").html(items.join(""));
        });
    }
    else {
        $("#search_results").html("");
    }
    return false;
}

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

