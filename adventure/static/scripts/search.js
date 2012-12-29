$(document).ready(function () {
    // Initialize search button function
    $("#search_button").click(ytsearch);
    // Initialize "instant" search function
    $("#search_query").keyup(ytsearch);
    //$("#player").css("display", "inline");
});

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

function autocomplete () {
    // hl=en <- language of query
    // ds=yt <- restricts search to youtube
    // client=youtube <- forces youtube style output (i.e. jsonp)
    // jsonp=p <- name of jsonp callback function
    // q={0} <- query term
    // callback=? <- species jsonp query for jquery
    $.getJSON("http://suggestqueries.google.com/complete/search?hl=en&ds=yt&jsonp=p&q=obama&client=youtube&callback=?");
}

