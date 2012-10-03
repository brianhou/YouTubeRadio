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

$(document).ready(function () {
    $("#search_button").click(ytsearch);
    $("#search_query").keyup(ytsearch);
    //$("#player").css("display", "inline");
});

function ytsearch(keyword) {
    var query = $("#search_query").val();
    if (query) {
        var url = "https://gdata.youtube.com/feeds/api/videos";
	var data = {"q":query, "alt":"json", "max-results":"5", "v":"2", "orderby":"relevance"};
            $.getJSON(url, data, function (data) {
                var items = [];
                $.each(data.feed.entry, function (key, val) {
                        items.push("<tr><td><a href=\"" + val.content.src + "\">" +
                                       "<img src=\"" + val.media$group.media$thumbnail[1].url + "\"/></a></td>" +
                                   "<td><strong>" +  val.title.$t + "</strong>" + 
                                       "<br>by " + val.author[0].name.$t +
                                       "<br>" +  secondsToHMS(val.media$group.yt$duration.seconds) +
                                       " | " + numAddCommas(val.yt$statistics.viewCount) + " views</td></tr>");
                });
                $("#search_results").html(items.join());
            });
    }
    else {
        $("#search_results").html("");
    }
}
