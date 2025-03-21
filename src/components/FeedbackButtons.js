import React from "react";

const FeedbackButtons = ({
  onFeedback,
  onNext,
  currentFeedback,
  similarVotes,
  notSimilarVotes,
}) => {
  return (
    <div>
      <button onClick={() => onFeedback(true)}>Similar ({similarVotes})</button>
      <button onClick={() => onFeedback(false)}>
        Not Similar ({notSimilarVotes})
      </button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default FeedbackButtons;
