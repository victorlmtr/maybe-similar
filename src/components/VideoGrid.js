import React from "react";
import YouTube from "react-youtube";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "var(--md-sys-color-surface-container)",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  width: "100%",
  maxWidth: "480px",
  minWidth: "300px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "hidden",
  // Add styles to make the video player blend better
  "& iframe": {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "transparent",
    marginTop: theme.spacing(1),
  },
}));

const VideoTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P"',
  color: "var(--md-sys-color-on-surface)",
  marginBottom: "0.5rem",
  fontSize: "0.8rem",
  width: "100%",
  textAlign: "center",
  wordWrap: "break-word",
  lineHeight: 1.6,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  height: "3.2rem",
}));

const VsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  minWidth: "120px",
  alignSelf: "center", // Center VS box vertically
}));

const VsText = styled(Typography)({
  fontFamily: '"Press Start 2P"',
  color: "var(--md-sys-color-on-surface)",
  fontSize: "2rem",
  margin: "0 2rem",
  alignSelf: "center",
});

const VideoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center", // Center items vertically
  justifyContent: "center",
  gap: theme.spacing(2),
  margin: "0 auto",
  width: "100%",
  maxWidth: "1200px", // Limit maximum width
  padding: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column", // Stack vertically on smaller screens
    gap: theme.spacing(3),
  },
}));

const ScoreCircle = styled(Box)({
  position: "relative",
  display: "inline-flex",
  marginTop: "1rem",
});

const SubmissionInfo = styled(Paper)(({ theme }) => ({
  backgroundColor: "var(--md-sys-color-surface-container)",
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  width: "100%",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const SubmissionText = styled(Typography)(({ theme }) => ({
  fontFamily: "Roboto, sans-serif",
  color: "var(--md-sys-color-on-surface-variant)",
  fontSize: "0.9rem",
  textAlign: "center",
  lineHeight: 1.6,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const Username = styled("span")({
  color: "var(--md-sys-color-on-surface)",
  fontWeight: 500,
  fontFamily: '"Press Start 2P"',
  fontSize: "0.7rem",
  transform: "translateY(2px)",
  display: "inline-block",
});

const VideoGrid = ({ video1, video2, averageScore, username, dateCreated }) => {
  const getPlayerOptions = (video) => ({
    height: "270",
    width: "480", // Set fixed width for consistency
    playerVars: {
      start: video.start,
      end: video.end,
      autoplay: 0,
      modestbranding: 1, // Remove YouTube logo
      showinfo: 0, // Hide video title and uploader
      rel: 0, // Hide related videos
    },
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <VideoContainer>
        <StyledPaper elevation={3}>
          <VideoTitle>{video1.songName}</VideoTitle>
          <YouTube videoId={video1.id} opts={getPlayerOptions(video1)} />
        </StyledPaper>

        <VsBox>
          <VsText>VS.</VsText>
          <ScoreCircle>
            <CircularProgress
              variant="determinate"
              value={averageScore}
              size={60}
              thickness={4}
              sx={{
                color: getScoreColor(averageScore),
                position: "absolute",
              }}
            />
            <CircularProgress
              variant="determinate"
              value={100}
              size={60}
              thickness={4}
              sx={{
                color: "var(--md-sys-color-surface-variant)",
                opacity: 0.2,
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Press Start 2P"',
                  fontSize: "0.8rem",
                  color: "var(--md-sys-color-on-surface)",
                }}
              >
                {`${Math.round(averageScore)}%`}
              </Typography>
            </Box>
          </ScoreCircle>
        </VsBox>

        <StyledPaper elevation={3}>
          <VideoTitle>{video2.songName}</VideoTitle>
          <YouTube videoId={video2.id} opts={getPlayerOptions(video2)} />
        </StyledPaper>
      </VideoContainer>

      <SubmissionInfo elevation={3}>
        <SubmissionText>
          suggested by <Username>{username}</Username>
        </SubmissionText>
        <SubmissionText>
          on <Username>{formatDate(dateCreated)}</Username>
        </SubmissionText>
      </SubmissionInfo>
    </Box>
  );
};

const getScoreColor = (score) => {
  if (score < 33) return "rgb(147, 0, 10)";
  if (score < 66) return "rgb(255, 176, 0)";
  return "rgb(46, 106, 68)";
};

export default VideoGrid;
