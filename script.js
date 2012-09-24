var tag = document.createElement('script');
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
player = new YT.Player('player', {
  height: '390',
  width: '640',
  videoId: 'u1zgFlCw8Aw',
  events: {
    'onReady': function() {$("#search_button").disabled=false;},
    'onStateChange': onPlayerStateChange
  }
});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
if (event.data == YT.PlayerState.PLAYING && !done) {
  setTimeout(stopVideo, 6000);
  done = true;
} }

function stopVideo() {
    player.stopVideo();
}

$(document).ready(function() {
    
    $("#search_button").click(function() {
        var query = $("#search_query").val();
        $("#player").css("display", "inline");
    });
});
