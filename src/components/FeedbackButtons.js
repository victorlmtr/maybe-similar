import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const ButtonContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "2rem",
});

const NavigationButton = styled(Button)({
  fontFamily: '"Press Start 2P"',
  fontSize: "0.8rem",
  padding: "1rem 2rem",
  backgroundColor: "var(--md-sys-color-surface-variant) !important",
  color: "var(--md-sys-color-on-surface-variant) !important",
  "&:hover": {
    backgroundColor: "var(--md-sys-color-surface-container-high) !important",
    opacity: 0.9,
  },
});

const SimilarButton = styled(Button)({
  fontFamily: '"Press Start 2P"',
  fontSize: "0.8rem",
  padding: "1rem 2rem",
  backgroundColor: "rgb(46, 106, 68) !important", // Darker green
  color: "rgb(177, 241, 193) !important", // Light green text
  "&:hover": {
    backgroundColor: "rgb(66, 126, 88) !important", // Slightly lighter green
    opacity: 0.9,
  },
  "&:disabled": {
    backgroundColor: "var(--md-sys-color-surface-container) !important",
    color: "var(--md-sys-color-on-surface) !important",
    opacity: 0.5,
  },
});

const NotSimilarButton = styled(Button)({
  fontFamily: '"Press Start 2P"',
  fontSize: "0.8rem",
  padding: "1rem 2rem",
  backgroundColor: "rgb(147, 0, 10) !important", // Darker red
  color: "rgb(255, 218, 214) !important", // Light red text
  "&:hover": {
    backgroundColor: "rgb(167, 20, 30) !important", // Slightly lighter red
    opacity: 0.9,
  },
  "&:disabled": {
    backgroundColor: "var(--md-sys-color-surface-container) !important",
    color: "var(--md-sys-color-on-surface) !important",
    opacity: 0.5,
  },
});

const FeedbackButtons = ({
  onFeedback,
  onNext,
  onPrevious,
  currentFeedback,
  similarVotes,
  notSimilarVotes,
}) => {
  return (
    <ButtonContainer>
      <NavigationButton variant="contained" onClick={onPrevious}>
        Previous
      </NavigationButton>
      <SimilarButton
        variant="contained"
        onClick={() => onFeedback(true)}
        disabled={currentFeedback === true}
      >
        Similar ({similarVotes})
      </SimilarButton>
      <NotSimilarButton
        variant="contained"
        onClick={() => onFeedback(false)}
        disabled={currentFeedback === false}
      >
        Not Similar ({notSimilarVotes})
      </NotSimilarButton>
      <NavigationButton variant="contained" onClick={onNext}>
        Next
      </NavigationButton>
    </ButtonContainer>
  );
};

export default FeedbackButtons;
