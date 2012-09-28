function secondsToHMS(d){
    d = Number(d);
    var h = Math.floor(d / 3600); var m = Math.floor((d % 3600) / 60); var s = d % 60;
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);}

$(document).ready(function() {
    
    $("#search_button").click(ytsearch);
    $("#search_query").keyup(ytsearch);
    //$("#player").css("display", "inline");
});

function ytsearch(keyword){
    var query = $("#search_query").val();
    if (query != ""){
        var url = "https://gdata.youtube.com/feeds/api/videos";
        var data = {"q":query, "alt":"json", "max-results":"5", "v":"2", "orderby":"relevance"};
            $.getJSON(url, data, function(data) {
                var items = [];
                $.each(data.feed.entry, function(key, val) {
                        items.push("<tr><td><a href=\"" + val.content.src + "\"><img src=\"" + val.media$group.media$thumbnail[1].url + "\"/></a></td><td><em>" + val.title.$t + "</em><br>by " + val.author[0].name.$t + "<br>" +  secondsToHMS(val.media$group.yt$duration.seconds) + " | " + val.yt$statistics.viewCount + " views</td></tr>"); // attempting to add hh:mm:ss, but it doesn't necessarily have the right number of digits in mm and ss
                });
                $("#search_results").html(items.join());

            });
    }
    else{
        $("#search_results").html("");
    }
}
