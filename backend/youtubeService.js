const fetch = require("node-fetch");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const getVideoDetails = async (videoId) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`;
  console.log(`Fetching details for video ID: ${videoId}`);
  const response = await fetch(url);
  const data = await response.json();
  console.log(`Response data for video ID ${videoId}:`, JSON.stringify(data));

  if (data.items && data.items.length > 0) {
    const video = data.items[0];
    const songName = video.snippet.title;
    const artistName = video.snippet.channelTitle;

    return { songName, artistName };
  }

  return { songName: "", artistName: "" };
};

module.exports = { getVideoDetails };
