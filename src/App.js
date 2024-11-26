import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VideoGrid from './components/VideoGrid';
import FeedbackButtons from './components/FeedbackButtons';

const videoPairs = [
    {
        video1: { id: "u09s0uz0tEU", start: 0, end: 15 },
        video2: { id: "ioqgrYorhkU", start: 0, end: 15 },
    },
    {
        video1: { id: "Nfql0PyA8D0", start: 0, end: 15 },
        video2: { id: "KV3ozZoQ13M", start: 0, end: 15 },
    },
];

function App() {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [feedback, setFeedback] = useState(videoPairs.map(() => null));

    const handleFeedback = (isSimilar) => {
        const updatedFeedback = [...feedback];
        updatedFeedback[currentPairIndex] = isSimilar;
        setFeedback(updatedFeedback);
    };

    const handleNext = () => {
        if (currentPairIndex < videoPairs.length - 1) {
            setCurrentPairIndex(currentPairIndex + 1);
        } else {
            alert("Vous avez parcouru toutes les suggestions.");
        }
    };

    const currentPair = videoPairs[currentPairIndex];

    return (
        <div>
            <Navbar />
            <VideoGrid video1={currentPair.video1} video2={currentPair.video2} />
            <FeedbackButtons
                onFeedback={handleFeedback}
                onNext={handleNext}
                currentFeedback={feedback[currentPairIndex]}
            />
        </div>
    );
}

export default App;
