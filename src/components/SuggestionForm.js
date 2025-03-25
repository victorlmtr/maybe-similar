import React, { useState } from "react";
import YouTube from "react-youtube";

const SuggestionForm = () => {
  const [username, setUsername] = useState("");
  const [video1, setVideo1] = useState({ id: "", start: 0, end: 15 });
  const [video2, setVideo2] = useState({ id: "", start: 0, end: 15 });
  const [videoSearch, setVideoSearch] = useState("");
  const [player, setPlayer] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  // Function to extract video ID and start time from the YouTube URL
  const extractVideoDetails = (url) => {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    const startTime = parseInt(urlObj.searchParams.get("t"), 10) || 0;
    return { videoId, startTime };
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (videoSearch.includes("youtube.com")) {
      const { videoId, startTime } = extractVideoDetails(videoSearch);
      if (videoId) {
        player.loadVideoById({ videoId, startSeconds: startTime });
      }
    } else {
      // Fetch search results from YouTube Data API
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${videoSearch}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      setSearchResults(data.items);
    }
  };

  const handlePlayerReady = (event) => {
    setPlayer(event.target);
  };

  const handleVideoSelected = (videoNumber) => {
    const currentUrl = player.getVideoUrl();
    const currentTime = Math.floor(player.getCurrentTime());
    const { videoId } = extractVideoDetails(currentUrl);
    const videoDetails = videoNumber === 1 ? video1 : video2;
    const updatedVideoDetails = {
      ...videoDetails,
      id: videoId,
      start: currentTime,
      end: currentTime + 15,
    };
    videoNumber === 1
      ? setVideo1(updatedVideoDetails)
      : setVideo2(updatedVideoDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, video1, video2 }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("Suggestion submitted");
        setUsername("");
        setVideo1({ id: "", start: 0, end: 15 });
        setVideo2({ id: "", start: 0, end: 15 });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <label>Search for a YouTube video:</label>
        <input
          type="text"
          value={videoSearch}
          onChange={(e) => setVideoSearch(e.target.value)}
          placeholder="Enter song name or YouTube URL"
          required
        />
        <button type="submit">Search</button>
      </form>

      {searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id.videoId}>
                <button
                  onClick={() =>
                    player.loadVideoById({ videoId: result.id.videoId })
                  }
                >
                  {result.snippet.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <YouTube
        videoId=""
        opts={{ height: "390", width: "640", playerVars: { autoplay: 1 } }}
        onReady={handlePlayerReady}
      />

      <button onClick={() => handleVideoSelected(1)}>Use for Video 1</button>
      <button onClick={() => handleVideoSelected(2)}>Use for Video 2</button>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Video 1 ID:</label>
          <input type="text" value={video1.id} readOnly />
          <label>Start Time:</label>
          <input type="number" value={video1.start} readOnly />
          <label>End Time:</label>
          <input type="number" value={video1.end} readOnly />
        </div>
        <div>
          <label>Video 2 ID:</label>
          <input type="text" value={video2.id} readOnly />
          <label>Start Time:</label>
          <input type="number" value={video2.start} readOnly />
          <label>End Time:</label>
          <input type="number" value={video2.end} readOnly />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SuggestionForm;
