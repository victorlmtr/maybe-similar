import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
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

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2), // Reduced from 3 to 2
    paddingRight: theme.spacing(1), // Add smaller padding on the right
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: drawerWidth,
    }),
    width: "100%",
    paddingTop: "88px",
    minHeight: "100vh",
    position: "relative",
    overflow: "auto",
  })
);
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: '"Press Start 2P", cursive',
  },
});

function App() {
  const [videoPairs, setVideoPairs] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [sessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handlePrevious = () => {
    if (currentPairIndex > 0) {
      setCurrentPairIndex(currentPairIndex - 1);
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: "var(--md-sys-color-background)",
          }}
        >
          <Navbar />
          <Box sx={{ display: "flex", flex: 1, position: "relative" }}>
            <Main open={sidebarOpen}>
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  position: "fixed",
                  right: sidebarOpen ? drawerWidth + 16 : 16,
                  top: 72,
                  color: "var(--md-sys-color-on-surface)",
                  backgroundColor: "var(--md-sys-color-surface-container)",
                  "&:hover": {
                    backgroundColor:
                      "var(--md-sys-color-surface-container-high)",
                  },
                  zIndex: 1,
                }}
              >
                <Menu />
              </IconButton>
              <Routes>
                <Route path="/add-suggestion" element={<SuggestionForm />} />
                <Route
                  path="/"
                  element={
                    currentPair && currentPair.video1 && currentPair.video2 ? (
                      <Box>
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
            </Main>
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              submissions={videoPairs}
            />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
