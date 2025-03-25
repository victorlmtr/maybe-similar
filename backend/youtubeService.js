const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const getVideoDetails = async (videoId) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      const songName = video.snippet.title;
      const artistName = video.snippet.channelTitle;

      return { songName, artistName };
    }

    return { songName: "", artistName: "" };
  } catch (error) {
    console.error(
      `Error fetching video details for video ID ${videoId} with api key= ${YOUTUBE_API_KEY}:`,
      error
    );
    return { songName: "", artistName: "" };
  }
};

module.exports = { getVideoDetails };
