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
			items.push("<tr><td><img src=\"" + val.media$group.media$thumbnail[1].url + "\"/></td><td>" + val.title.$t + "</td></tr>");
		});
		    $("#search_results").html(items.join());

	    });
    }else{
	    $("#search_results").html("");
    }
}
