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
                        items.push("<tr><td><a href=\"" + val.content.src + "\"><img src=\"" + val.media$group.media$thumbnail[1].url + "\"/></a></td><td><em>" + val.title.$t + "</em><br>by " + val.author[0].name.$t + "<br>" + val.media$group.yt$duration.seconds + " seconds | " + val.yt$statistics.viewCount + " views</td></tr>");
                });
                $("#search_results").html(items.join());

            });
    }
    else{
        $("#search_results").html("");
    }
}
