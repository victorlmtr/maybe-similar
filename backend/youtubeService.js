const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const getVideoDetails = async (videoId) => {
  console.log(`Attempting to fetch details for video ${videoId}`);
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`;
  try {
    console.log("Fetching from YouTube API...");
    const response = await fetch(url);
    const data = await response.json();
    console.log("YouTube API response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("YouTube API Error:", data.error);
      throw new Error(data.error.message);
    }

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      const songName = video.snippet.title;
      const artistName = video.snippet.channelTitle;
      console.log(`Successfully fetched details for ${videoId}:`, {
        songName,
        artistName,
      });
      return { songName, artistName };
    }

    console.log(`No details found for video ${videoId}`);
    return { songName: "Video Unavailable", artistName: "" };
  } catch (error) {
    console.error(
      `Error fetching video details for video ID ${videoId}:`,
      error
    );
    return { songName: "Video Unavailable", artistName: "" };
  }
};

module.exports = { getVideoDetails };
