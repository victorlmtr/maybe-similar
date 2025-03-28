import React from "react";
import YouTube from "react-youtube";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

//Single Video container
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "var(--md-sys-color-surface-container)",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  width: "480px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "hidden",
}));

const VideoTitle = styled(Typography)({
  fontFamily: '"Press Start 2P"',
  color: "var(--md-sys-color-on-surface)",
  marginBottom: "1rem",
  fontSize: "0.9rem",
  width: "100%",
  textAlign: "center",
  wordWrap: "break-word",
  lineHeight: 1.6,
});

const VsBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "100px",
  padding: "0",
  margin: "0 -0.5rem",
});

const VsText = styled(Typography)({
  fontFamily: '"Press Start 2P"',
  color: "var(--md-sys-color-on-surface)",
  fontSize: "2rem",
  margin: "0 2rem",
  alignSelf: "center",
});

const VideoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  flexWrap: "wrap",
  margin: "0 1rem",
  width: "fit-content",
});

const ScoreCircle = styled(Box)({
  position: "relative",
  display: "inline-flex",
  marginTop: "1rem",
});

const SubmissionInfo = styled(Typography)({
  fontFamily: "Roboto, sans-serif",
  color: "var(--md-sys-color-on-surface-variant)",
  fontSize: "0.9rem",
  textAlign: "center",
  marginTop: "2rem",
});

const getScoreColor = (score) => {
  if (score < 33) return "rgb(147, 0, 10)";
  if (score < 66) return "rgb(255, 176, 0)";
  return "rgb(46, 106, 68)";
};

const VideoGrid = ({ video1, video2, averageScore, username, dateCreated }) => {
  const getPlayerOptions = (video) => ({
    height: "270",
    width: "480",
    playerVars: {
      start: video.start,
      end: video.end,
      autoplay: 0,
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

      <SubmissionInfo>
        suggested by {username} on {formatDate(dateCreated)}
      </SubmissionInfo>
    </Box>
  );
};

export default VideoGrid;
