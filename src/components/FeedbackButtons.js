import React from "react";

const FeedbackButtons = ({
  onFeedback,
  onNext,
  currentFeedback,
  similarVotes,
  notSimilarVotes,
  averageScore,
}) => {
  return (
    <div>
      <p>Average Score: {averageScore.toFixed(2)}</p>
      <button
        onClick={() => onFeedback(true)}
        disabled={currentFeedback === true}
      >
        Similar ({similarVotes})
      </button>
      <button
        onClick={() => onFeedback(false)}
        disabled={currentFeedback === false}
      >
        Not Similar ({notSimilarVotes})
      </button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default FeedbackButtons;
