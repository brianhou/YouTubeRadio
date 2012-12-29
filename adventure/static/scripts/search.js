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

function ytsearch(keyword) {
    var query = $("#search_query").val();
    if (query) {
        var url = "https://gdata.youtube.com/feeds/api/videos";
        var data = {"q":query, "alt":"json", "max-results":"5", "v":"2", "orderby":"relevance"};
        $.getJSON(url, data, function (data) {
            var items = [];
            $.each(data.feed.entry, function (key, val) {
                var html = "<tr onClick=\"document.location='{0}';\">" +
                			"<td><img src=\"{1}\"/></a></td>" +
                			"<td><strong>{2}</strong><br>by {3}<br>{4} | {5} views</td>" +
                			"</tr>"
            	items.push(html.format(
						    val.content.src,
						    val.media$group.media$thumbnail[1].url,
						    val.title.$t,
						    val.author[0].name.$t,
						    secondsToHMS(val.media$group.yt$duration.seconds),
						    numAddCommas(val.yt$statistics.viewCount))
            	);
            });
            $("#search_results").html(items.join());
        });
    }
    else {
        $("#search_results").html("");
    }
}
