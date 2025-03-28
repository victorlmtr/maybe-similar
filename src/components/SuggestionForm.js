import React, { useState } from "react";
import YouTube from "react-youtube";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Search, CheckCircleOutline } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "var(--md-sys-color-surface-container)",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  width: "100%",
  maxWidth: "800px",
}));

const Title = styled(Typography)({
  fontFamily: '"Press Start 2P"',
  fontSize: "1.2rem",
  marginBottom: "2rem",
  textAlign: "center",
});

const VideoContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "2rem",
});

const ButtonContainer = styled(Box)({
  display: "flex",
  gap: "1rem",
  marginTop: "1rem",
  justifyContent: "center",
});

const SuccessDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "var(--md-sys-color-surface-container)",
    padding: theme.spacing(2),
    maxWidth: "400px",
    textAlign: "center",
  },
}));

const SuggestionForm = ({ refreshData }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [video1, setVideo1] = useState({ id: "", start: 0, end: 15 });
  const [video2, setVideo2] = useState({ id: "", start: 0, end: 15 });
  const [videoSearch, setVideoSearch] = useState("");
  const [player, setPlayer] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  // New states for handling loading and errors
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  const showSnackbar = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Function to extract video ID and start time from the YouTube URL
  const extractVideoDetails = (url) => {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    const startTime = parseInt(urlObj.searchParams.get("t"), 10) || 0;
    return { videoId, startTime };
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      if (videoSearch.includes("youtube.com")) {
        const { videoId, startTime } = extractVideoDetails(videoSearch);
        if (videoId) {
          player.loadVideoById({ videoId, startSeconds: startTime });
        } else {
          throw new Error("Invalid YouTube URL");
        }
      } else {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${videoSearch}&type=video&key=${YOUTUBE_API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = await response.json();
        setSearchResults(data.items);
      }
    } catch (error) {
      showSnackbar(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const validateVideos = () => {
    if (!video1.id || !video2.id) {
      throw new Error("Please select both videos");
    }
    if (video1.id === video2.id) {
      throw new Error("Please select two different videos");
    }
    if (!username.trim()) {
      throw new Error("Please enter a username");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      validateVideos();

      const response = await fetch("/maybe-similar/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, video1, video2 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit suggestion");
      }

      await response.json();
      setSuccessDialogOpen(true);
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      showSnackbar(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    // Reset form
    setUsername("");
    setVideo1({ id: "", start: 0, end: 15 });
    setVideo2({ id: "", start: 0, end: 15 });
    setVideoSearch("");
    setSearchResults([]);
    // Navigate to home page
    navigate("/");
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", width: "100%", p: 2 }}
    >
      <StyledPaper elevation={3}>
        <Title>Add a new suggestion</Title>

        {/* Search Form */}
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={videoSearch}
            onChange={(e) => setVideoSearch(e.target.value)}
            placeholder="Enter song name or YouTube URL"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSearching}
            sx={{
              backgroundColor: "var(--md-sys-color-primary)",
              "&:hover": {
                backgroundColor: "var(--md-sys-color-primary-container)",
              },
            }}
          >
            {isSearching ? <CircularProgress size={24} /> : "Search"}
          </Button>
        </Box>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontFamily: '"Press Start 2P"', fontSize: "0.9rem" }}
            >
              Search Results:
            </Typography>
            <List>
              {searchResults.map((result) => (
                <ListItem key={result.id.videoId} disablePadding>
                  <ListItemButton
                    onClick={() =>
                      player.loadVideoById({ videoId: result.id.videoId })
                    }
                    sx={{
                      backgroundColor:
                        "var(--md-sys-color-surface-container-high)",
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText primary={result.snippet.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Video Player */}
        <VideoContainer>
          <YouTube
            videoId=""
            opts={{
              height: "315",
              width: "560",
              playerVars: { autoplay: 1 },
            }}
            onReady={handlePlayerReady}
          />

          <ButtonContainer>
            <Button
              variant="contained"
              onClick={() => handleVideoSelected(1)}
              sx={{
                backgroundColor: "var(--md-sys-color-secondary-container)",
                color: "var(--md-sys-color-on-secondary-container)",
              }}
            >
              Use for Video 1
            </Button>
            <Button
              variant="contained"
              onClick={() => handleVideoSelected(2)}
              sx={{
                backgroundColor: "var(--md-sys-color-secondary-container)",
                color: "var(--md-sys-color-on-secondary-container)",
              }}
            >
              Use for Video 2
            </Button>
          </ButtonContainer>
        </VideoContainer>

        {/* Submission Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Selected Videos:
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Video 1
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Video ID"
                value={video1.id}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <TextField
                label="Start Time"
                value={video1.start}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <TextField
                label="End Time"
                value={video1.end}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Video 2
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Video ID"
                value={video2.id}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <TextField
                label="Start Time"
                value={video2.start}
                InputProps={{ readOnly: true }}
                size="small"
              />
              <TextField
                label="End Time"
                value={video2.end}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              backgroundColor: "var(--md-sys-color-primary)",
              "&:hover": {
                backgroundColor: "var(--md-sys-color-primary-container)",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              "Submit Suggestion"
            )}
          </Button>
        </Box>
      </StyledPaper>
      {/* Success Dialog */}
      <SuccessDialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <CheckCircleOutline sx={{ color: "var(--md-sys-color-primary)" }} />
            Success!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Your suggestion has been submitted successfully! You will be
            redirected to the home page.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </SuccessDialog>

      {/* Error/Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuggestionForm;
