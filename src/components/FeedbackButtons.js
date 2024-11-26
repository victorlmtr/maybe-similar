import React from 'react';

const FeedbackButtons = ({ onFeedback, onNext, currentFeedback }) => {
    return (
        <div className="text-center mt-4">
            <div>
                <button
                    className={`btn me-2 ${currentFeedback === true ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => onFeedback(true)}
                >
                    Similaire
                </button>
                <button
                    className={`btn me-2 ${currentFeedback === false ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => onFeedback(false)}
                >
                    Pas similaire
                </button>
            </div>
            <div className="mt-4">
                <button className="btn btn-secondary" onClick={onNext}>
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default FeedbackButtons;
