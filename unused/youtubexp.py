# Use Python 2.7, yabitch.

# Thoughts:

# 01. Ask user to search for what video they want to watch, like how they do in a typical YouTube window.

# 02. Once they pick the seed video, open that player in a larger screen. Some suggested videos should be on the side, maybe in a pretty scrollbar?

# 03. Anytime during the video, the user can click one of the suggested videos. However, if the user doesn't choose one or chooses to skip, the app will automatically choose for them.

# 04. The app will store the video ID so that the same video isn't accidentally played twice. Also store the time at which it started playing (so user can look at what was played).

# 05. Well, I guess there should be a history of all played songs (or the last n).

import gdata.youtube
import gdata.youtube.service
yt_service = gdata.youtube.service.YouTubeService()
yt_service.ssl = True
yt_service.developer_key = 'AI39si5Qhb1zpJVCuudxeWSmOEI-9cDE2Cpk457J71XODD0pX6Buq3Hznh5ndANY9BHzuZ-fmtcnrbfTgBYgH1QvNuU7_ZeoYQ' # Brian's dev key for this project
yt_service.client_id = 'YouTubeRadio'

#def getprint_videofeed(uri):
#    feed = yt_service.GetYouTubeVideoFeed(uri)
#    for entry in feed.entry:
#        PrintEntryDetails(entry)

temp_try = yt_service.GetYouTubeVideoEntry(video_id='N2flRl9-_ck')
# Video Data = (Title, Duration, Thumbnail, Flash Player)
vid_data = (temp_try.media.title.text, temp_try.media.duration.seconds, temp_try.media.thumbnail[0].url, temp_try.GetSwfUrl())

print temp_try.media.thumbnail[0].url # Gets the URL to a video's thumbnail.
print temp_try.media.duration.seconds # Gets length of video in seconds.
print temp_try.media.title.text # Gets title.
print temp_try.media.player.url # Gets video watch page. ## Don't need this, it links to the regular YouTube page.
print temp_try.GetSwfUrl() # Gets the flash player URL? ## HOLY SHIT IT JUST PLAYS! ### https://developers.google.com/youtube/2.0/developers_guide_protocol#Displaying_information_about_a_video

# related_feed = yt_service.GetYouTubeRelatedVideoFeed(video_id='***INSERT ID HERE***') # Should take in a seed (and subsequent 'seeds') to populate a list of related videos. Applying this seems to be the crux of the app.

def search(search_terms):
    query = gdata.youtube.service.YouTubeVideoQuery()
    query.vq = search_terms
    query.orderby = 'relevance'
    feed = yt_service.YouTubeQuery(query)
    return feed
