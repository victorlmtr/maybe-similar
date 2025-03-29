import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import VideoGrid from "./components/VideoGrid";
import FeedbackButtons from "./components/FeedbackButtons";
import SuggestionForm from "./components/SuggestionForm";
import "@fontsource/press-start-2p";
import Sidebar from "./components/Sidebar";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";

const drawerWidth = 340;

const Main = styled("main")(({ theme, sidebarOnBottom }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  paddingTop: "96px",
  paddingBottom: sidebarOnBottom ? `${drawerWidth}px` : theme.spacing(2),
  minHeight: "100vh",
  position: "relative",
  display: "flex",
  justifyContent: "center",
}));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

function AppContent() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [videoPairs, setVideoPairs] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [sessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");

  const getSortedVideoPairs = (pairs) => {
    return [...pairs].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date_added) - new Date(a.date_added);
      }
      const scoreA =
        (a.similarVotes / (a.similarVotes + a.notSimilarVotes)) * 100 || 0;
      const scoreB =
        (b.similarVotes / (b.similarVotes + b.notSimilarVotes)) * 100 || 0;
      return scoreB - scoreA;
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const idParam = urlParams.get("id");

    if (idParam && videoPairs.length > 0) {
      const index = videoPairs.findIndex(
        (pair) => pair.id === parseInt(idParam)
      );
      if (index !== -1) {
        setCurrentPairIndex(index);
      }
    }
  }, [location.search, videoPairs]);

  // Modify the data fetching useEffect
  useEffect(() => {
    const fetchData = () => {
      fetch("/maybe-similar/api/videos")
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

          // Sort the data before setting state
          const sortedData = getSortedVideoPairs(transformedData);
          setVideoPairs(sortedData);
          setFeedback(sortedData.map(() => null));

          // Handle URL parameters
          const urlParams = new URLSearchParams(location.search);
          const idParam = urlParams.get("id");

          if (idParam) {
            const index = sortedData.findIndex(
              (pair) => pair.id === parseInt(idParam)
            );
            if (index !== -1) {
              setCurrentPairIndex(index);
            }
          } else {
            // If no ID parameter, show the first item from sorted data
            setCurrentPairIndex(0);
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    };

    fetchData();
  }, [sortBy]);

  const handleNext = () => {
    const sortedPairs = getSortedVideoPairs(videoPairs);
    const currentId = videoPairs[currentPairIndex].id;
    const currentSortedIndex = sortedPairs.findIndex(
      (pair) => pair.id === currentId
    );

    if (currentSortedIndex < sortedPairs.length - 1) {
      const nextPair = sortedPairs[currentSortedIndex + 1];
      const nextIndex = videoPairs.findIndex((pair) => pair.id === nextPair.id);
      setCurrentPairIndex(nextIndex);
      navigate(`/?id=${nextPair.id}`);
    }
  };

  const handlePrevious = () => {
    const sortedPairs = getSortedVideoPairs(videoPairs);
    const currentId = videoPairs[currentPairIndex].id;
    const currentSortedIndex = sortedPairs.findIndex(
      (pair) => pair.id === currentId
    );

    if (currentSortedIndex > 0) {
      const prevPair = sortedPairs[currentSortedIndex - 1];
      const prevIndex = videoPairs.findIndex((pair) => pair.id === prevPair.id);
      setCurrentPairIndex(prevIndex);
      navigate(`/?id=${prevPair.id}`);
    }
  };

  const handleFeedback = (isSimilar) => {
    const updatedFeedback = [...feedback];
    const currentFeedback = updatedFeedback[currentPairIndex];

    if (currentFeedback === isSimilar) {
      return;
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

    fetch("/maybe-similar/api/feedback", {
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

  const currentPair = videoPairs[currentPairIndex] || null;
  const totalVotes = currentPair
    ? currentPair.similarVotes + currentPair.notSimilarVotes
    : 0;
  const averageScore = totalVotes
    ? (currentPair.similarVotes / totalVotes) * 100
    : 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "var(--md-sys-color-background)",
        overflow: "auto", // Changed from 'hidden' to 'auto'
      }}
    >
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          flexDirection: isMobile ? "column" : "row",
          width: "100%",
        }}
      >
        <Main sidebarOnBottom={isMobile}>
          <Box
            sx={{
              width: "100%",
              maxWidth: isMobile ? "100%" : "calc(100vw - 340px)", // Adjust max width based on screen size
              display: "flex",
              justifyContent: "center",
              position: "relative",
              margin: "0 auto",
            }}
          >
            <Routes>
              <Route
                path="/add-suggestion"
                element={
                  <SuggestionForm
                    refreshData={async () => {
                      try {
                        const response = await fetch(
                          "/maybe-similar/api/videos"
                        );
                        const data = await response.json();
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
                        // Sort the data before setting state
                        const sortedData = getSortedVideoPairs(transformedData);
                        setVideoPairs(sortedData);
                        setFeedback(sortedData.map(() => null));
                      } catch (error) {
                        console.error("Error refreshing data:", error);
                      }
                    }}
                  />
                }
              />
              <Route
                path="/"
                element={
                  currentPair && currentPair.video1 && currentPair.video2 ? (
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: "1200px", // Add a maxWidth to contain the content
                        margin: "0 auto", // Center the content
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <VideoGrid
                        video1={currentPair.video1}
                        video2={currentPair.video2}
                        averageScore={averageScore}
                        username={currentPair.username}
                        dateCreated={currentPair.date_added}
                      />
                      <FeedbackButtons
                        onFeedback={handleFeedback}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        currentFeedback={feedback[currentPairIndex]}
                        similarVotes={currentPair.similarVotes}
                        notSimilarVotes={currentPair.notSimilarVotes}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ color: "var(--md-sys-color-on-surface)" }}>
                      Currently no videos to display.
                    </Box>
                  )
                }
              />
            </Routes>
          </Box>
        </Main>
        <Sidebar
          submissions={videoPairs}
          sortBy={sortBy}
          onSortChange={(newSortBy) => setSortBy(newSortBy)}
          currentPairId={currentPair?.id}
          isMobile={isMobile}
        />
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router basename="/maybe-similar">
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
