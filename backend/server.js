const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const { getVideoDetails } = require("./youtubeService");

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to get video details from database or YouTube API
async function getOrFetchVideoDetails(videoId) {
  try {
    // Try to get from database first
    const dbResult = await pool.query(
      "SELECT * FROM video_details WHERE video_id = $1",
      [videoId]
    );

    if (dbResult.rows.length > 0) {
      const videoDetails = dbResult.rows[0];
      // Check if details are older than 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      if (new Date(videoDetails.last_updated) > oneWeekAgo) {
        return {
          songName: videoDetails.title,
          artistName: videoDetails.channel_title,
        };
      }
    }

    // If not in database or outdated, fetch from YouTube API
    const details = await getVideoDetails(videoId);

    // Store or update in database
    await pool.query(
      `INSERT INTO video_details (video_id, title, channel_title, last_updated)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (video_id) 
       DO UPDATE SET 
         title = EXCLUDED.title,
         channel_title = EXCLUDED.channel_title,
         last_updated = CURRENT_TIMESTAMP`,
      [videoId, details.songName, details.artistName]
    );

    return details;
  } catch (error) {
    console.error(`Error getting video details for ${videoId}:`, error);
    return { songName: "Video Unavailable", artistName: "" };
  }
}
app.get("/api/test-video/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    console.log(`Testing video ID: ${videoId}`);

    const details = await getVideoDetails(videoId);
    console.log("YouTube API response:", details);

    res.json(details);
  } catch (err) {
    console.error("Test endpoint error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/videos", async (req, res) => {
  try {
    // Only fetch the core video pair data without YouTube details
    const result = await pool.query(`
      SELECT 
        id,
        username,
        video1_id,
        video1_start,
        video1_end,
        video2_id,
        video2_start,
        video2_end,
        date_added,
        similar_votes,
        not_similar_votes
      FROM video_pairs
    `);

    const videoPairs = result.rows;

    const videoDetailsPromises = videoPairs.map(async (pair) => {
      const [video1Details, video2Details] = await Promise.all([
        getOrFetchVideoDetails(pair.video1_id),
        getOrFetchVideoDetails(pair.video2_id),
      ]);

      return {
        ...pair,
        video1SongName: video1Details.songName,
        video1ArtistName: video1Details.artistName,
        video2SongName: video2Details.songName,
        video2ArtistName: video2Details.artistName,
      };
    });

    const videoPairsWithDetails = await Promise.all(videoDetailsPromises);
    res.json(videoPairsWithDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/api/feedback", async (req, res) => {
  const { pair_id, is_similar, session_id } = req.body;
  try {
    // Check if there's already a vote from this session for this pair
    const existingVote = await pool.query(
      "SELECT * FROM feedback WHERE pair_id = $1 AND session_id = $2",
      [pair_id, session_id]
    );

    if (existingVote.rows.length > 0) {
      // Update existing vote
      const previousVote = existingVote.rows[0];
      if (previousVote.is_similar !== is_similar) {
        // Update the feedback
        await pool.query(
          "UPDATE feedback SET is_similar = $1 WHERE pair_id = $2 AND session_id = $3",
          [is_similar, pair_id, session_id]
        );

        // Update vote counts
        if (is_similar) {
          await pool.query(
            "UPDATE video_pairs SET similar_votes = similar_votes + 1, not_similar_votes = not_similar_votes - 1 WHERE id = $1",
            [pair_id]
          );
        } else {
          await pool.query(
            "UPDATE video_pairs SET similar_votes = similar_votes - 1, not_similar_votes = not_similar_votes + 1 WHERE id = $1",
            [pair_id]
          );
        }
      }
    } else {
      // Insert new vote
      await pool.query(
        "INSERT INTO feedback (pair_id, is_similar, session_id) VALUES ($1, $2, $3)",
        [pair_id, is_similar, session_id]
      );

      // Update vote counts
      if (is_similar) {
        await pool.query(
          "UPDATE video_pairs SET similar_votes = similar_votes + 1 WHERE id = $1",
          [pair_id]
        );
      } else {
        await pool.query(
          "UPDATE video_pairs SET not_similar_votes = not_similar_votes + 1 WHERE id = $1",
          [pair_id]
        );
      }
    }

    res.status(201).json({ message: "Feedback submitted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/suggestions", async (req, res) => {
  const { username, video1, video2 } = req.body;
  try {
    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert video pair
      await client.query(
        "INSERT INTO video_pairs (username, video1_id, video1_start, video1_end, video2_id, video2_start, video2_end, date_added) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)",
        [
          username,
          video1.id,
          video1.start,
          video1.end,
          video2.id,
          video2.start,
          video2.end,
        ]
      );

      // Fetch and store video details for both videos
      await Promise.all([
        getOrFetchVideoDetails(video1.id),
        getOrFetchVideoDetails(video2.id),
      ]);

      await client.query("COMMIT");
      res.status(201).json({ message: "Suggestion submitted" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
