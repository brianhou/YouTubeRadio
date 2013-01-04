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
                }
            );
            suggestCallBack = function (data) {
                var suggestions = [];
                $.each(data[1], function(key, val) {
                    suggestions.push({"value":val[0]});
                });
                suggestions.length = 5;
                response(suggestions);
            };
        },
    });
});

var DEVKEY = 'AI39si5Qhb1zpJVCuudxeWSmOEI-9cDE2Cpk457J71XODD0pX6Buq3Hznh5ndANY9BHzuZ-fmtcnrbfTgBYgH1QvNuU7_ZeoYQ'

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
                			"<img class= \"img-rounded\" src=\"{1}\"/>" +
                			"<div><b><a href=\"javascript:selectVideo(\'{0}\')\"><span></span>{2}</a></b><br>" +
                			"by {3}<br>" +
                			"{4} | {5} views</div>" +
                			"<div class=\"clear\"></div></div>";
            	items.push(html.format(
						    val.media$group.yt$videoid.$t,
						    val.media$group.media$thumbnail[1].url,
						    val.title.$t,
						    val.author[0].name.$t,
						    secondsToHMS(val.media$group.yt$duration.seconds),
						    numAddCommas(val.yt$statistics.viewCount))
            	);
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
