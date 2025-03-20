import React, { useState } from "react";

const SuggestionForm = () => {
  const [username, setUsername] = useState("");
  const [video1, setVideo1] = useState({ id: "", start: 0, end: 15 });
  const [video2, setVideo2] = useState({ id: "", start: 0, end: 15 });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, video1, video2 }),
    })
      .then((response) => {
        console.log("Raw response:", response);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("Suggestion submitted");
        setUsername("");
        setVideo1({ id: "", start: 0, end: 15 });
        setVideo2({ id: "", start: 0, end: 15 });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Video 1 ID:</label>
        <input
          type="text"
          value={video1.id}
          onChange={(e) => setVideo1({ ...video1, id: e.target.value })}
          required
        />
        <label>Start Time:</label>
        <input
          type="number"
          value={video1.start}
          onChange={(e) => setVideo1({ ...video1, start: e.target.value })}
          required
        />
        <label>End Time:</label>
        <input
          type="number"
          value={video1.end}
          onChange={(e) => setVideo1({ ...video1, end: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Video 2 ID:</label>
        <input
          type="text"
          value={video2.id}
          onChange={(e) => setVideo2({ ...video2, id: e.target.value })}
          required
        />
        <label>Start Time:</label>
        <input
          type="number"
          value={video2.start}
          onChange={(e) => setVideo2({ ...video2, start: e.target.value })}
          required
        />
        <label>End Time:</label>
        <input
          type="number"
          value={video2.end}
          onChange={(e) => setVideo2({ ...video2, end: e.target.value })}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SuggestionForm;
