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
  const [sessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((response) => response.json())
      .then((data) => {
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
    const currentFeedback = updatedFeedback[currentPairIndex];

    if (currentFeedback === isSimilar) {
      return; // No change in feedback
    }

    updatedFeedback[currentPairIndex] = isSimilar;
    setFeedback(updatedFeedback);

    const updatedVideoPairs = [...videoPairs];
    const currentPair = updatedVideoPairs[currentPairIndex];

    if (currentFeedback === null) {
      if (isSimilar) {
        currentPair.similarVotes += 1;
      } else {
        currentPair.notSimilarVotes += 1;
      }
    } else {
      if (isSimilar) {
        currentPair.similarVotes += 1;
        currentPair.notSimilarVotes -= 1;
      } else {
        currentPair.similarVotes -= 1;
        currentPair.notSimilarVotes += 1;
      }
    }

    setVideoPairs(updatedVideoPairs);

    fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pair_id: currentPair.id,
        is_similar: isSimilar,
        session_id: sessionId,
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
      alert("You have gone through all the suggestions.");
    }
  };

  const currentPair = videoPairs[currentPairIndex] || null;
  const totalVotes = currentPair
    ? currentPair.similarVotes + currentPair.notSimilarVotes
    : 0;
  const averageScore = totalVotes
    ? (currentPair.similarVotes / totalVotes) * 100
    : 0;

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
                  averageScore={averageScore}
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
