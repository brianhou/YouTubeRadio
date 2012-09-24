$(document).ready(function() {
    
    $("#search_button").click(ytsearch);
    //$("#player").css("display", "inline");
});

function ytsearch(keyword){
    var query = $("#search_query").val();
    var url = "https://gdata.youtube.com/feeds/api/videos";
    var data = {"q":query, "alt":"json", "max-results":"5", "v":"2", "orderby":"relevance"};
    $.getJSON(url, data, function(data) {
        var items = [];
        $.each(data.feed.entry, function(key, val) {
		items.push("<tr><td>" + val.title.$t + "</td></tr>");
        });
            $("#search_results").html(items.join());

    });
}
