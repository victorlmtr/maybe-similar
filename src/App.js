import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import VideoGrid from "./components/VideoGrid";
import FeedbackButtons from "./components/FeedbackButtons";
import SuggestionForm from "./components/SuggestionForm";

function App() {
  const [videoPairs, setVideoPairs] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [voteCounts, setVoteCounts] = useState({ similar: 0, notSimilar: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((response) => response.json())
      .then((data) => {
        // Transform the fetched data to match the expected structure
        const transformedData = data.map((pair) => ({
          id: pair.id,
          username: pair.username,
          video1: {
            id: pair.video1_id,
            start: pair.video1_start,
            end: pair.video1_end,
            songName: pair.video1SongName,
            artistName: pair.video1ArtistName,
          },
          video2: {
            id: pair.video2_id,
            start: pair.video2_start,
            end: pair.video2_end,
            songName: pair.video2SongName,
            artistName: pair.video2ArtistName,
          },
          date_added: pair.date_added,
          similarVotes: pair.similar_votes || 0,
          notSimilarVotes: pair.not_similar_votes || 0,
        }));
        setVideoPairs(transformedData);
        setFeedback(transformedData.map(() => null));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleFeedback = (isSimilar) => {
    const updatedFeedback = [...feedback];
    updatedFeedback[currentPairIndex] = isSimilar;
    setFeedback(updatedFeedback);

    const updatedVoteCounts = { ...voteCounts };
    if (isSimilar) {
      updatedVoteCounts.similar += 1;
    } else {
      updatedVoteCounts.notSimilar += 1;
    }
    setVoteCounts(updatedVoteCounts);

    fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pair_id: videoPairs[currentPairIndex]?.id,
        is_similar: isSimilar,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Feedback submitted:", data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleNext = () => {
    if (currentPairIndex < videoPairs.length - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
    } else {
      alert("Vous avez parcouru toutes les suggestions.");
    }
  };

  const currentPair = videoPairs[currentPairIndex] || null;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/add-suggestion" element={<SuggestionForm />} />
        <Route
          path="/"
          element={
            currentPair && currentPair.video1 && currentPair.video2 ? (
              <>
                <VideoGrid
                  video1={currentPair.video1}
                  video2={currentPair.video2}
                />
                <p>Suggested by: {currentPair.username}</p>
                <p>
                  Date Added:{" "}
                  {new Date(currentPair.date_added).toLocaleString()}
                </p>
                <p>Video 1 Song: {currentPair.video1.songName}</p>
                <p>Video 1 Artist: {currentPair.video1.artistName}</p>
                <p>Video 2 Song: {currentPair.video2.songName}</p>
                <p>Video 2 Artist: {currentPair.video2.artistName}</p>
                <FeedbackButtons
                  onFeedback={handleFeedback}
                  onNext={handleNext}
                  currentFeedback={feedback[currentPairIndex]}
                  similarVotes={currentPair.similarVotes}
                  notSimilarVotes={currentPair.notSimilarVotes}
                />
              </>
            ) : (
              <p>Currently no videos to display.</p>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
