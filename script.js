$(document).ready(function() {
    
    $("#search_button").click(ytsearch);
    //$("#player").css("display", "inline");
});

function ytsearch(keyword){
        var query = $("#search_query").val();
        var url = "https://gdata.youtube.com/feeds/api/videos?q={0}&alt=json&max-results=5&v=2&orderby=relevance";
}
