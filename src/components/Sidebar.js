import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { ChevronRight, ChevronLeft, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const drawerWidth = 340;

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  justifyContent: "space-between",
  backgroundColor: "var(--md-sys-color-secondary-container)",
}));

const StyledCard = styled(Card)({
  backgroundColor: "var(--md-sys-color-surface-container)",
  marginBottom: "1rem",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "var(--md-sys-color-surface-container-high)",
  },
});

const ScoreCircle = styled(Box)({
  position: "relative",
  display: "inline-flex",
  margin: "0.5rem 0",
});

const getScoreColor = (score) => {
  if (score < 33) return "rgb(147, 0, 10)";
  if (score < 66) return "rgb(255, 176, 0)";
  return "rgb(46, 106, 68)";
};

const Sidebar = ({ open, onClose, submissions }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");

  const sortSubmissions = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date_added) - new Date(a.date_added);
      }
      const scoreA =
        (a.similarVotes / (a.similarVotes + a.notSimilarVotes)) * 100 || 0;
      const scoreB =
        (b.similarVotes / (b.similarVotes + b.notSimilarVotes)) * 100 || 0;
      return scoreB - scoreA;
    });
  };

  const filterSubmissions = (items) => {
    return items.filter(
      (item) =>
        item.video1.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.video2.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCardClick = (index) => {
    navigate(`/?id=${submissions[index].id}`);
    onClose();
  };

  const processedSubmissions = sortSubmissions(filterSubmissions(submissions));

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "var(--md-sys-color-secondary-container)",
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <DrawerHeader>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Press Start 2P"', fontSize: "1rem" }}
        >
          Submissions
        </Typography>
        <IconButton onClick={onClose}>
          <ChevronRight />
        </IconButton>
      </DrawerHeader>

      <Box sx={{ p: 2 }}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="date">Date submitted</MenuItem>
            <MenuItem value="score">Highest score</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search songs or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ overflowY: "auto", height: "calc(100vh - 200px)" }}>
          {processedSubmissions.map((submission, index) => {
            const score =
              submission.similarVotes + submission.notSimilarVotes > 0
                ? (submission.similarVotes /
                    (submission.similarVotes + submission.notSimilarVotes)) *
                  100
                : 0;

            return (
              <StyledCard
                key={submission.id}
                onClick={() => handleCardClick(index)}
              >
                <CardContent>
                  <Typography
                    sx={{
                      fontFamily: '"Press Start 2P"',
                      fontSize: "0.8rem",
                      mb: 1,
                    }}
                  >
                    {submission.video1.songName} vs.{" "}
                    {submission.video2.songName}
                  </Typography>

                  <ScoreCircle>
                    <CircularProgress
                      variant="determinate"
                      value={score}
                      size={40}
                      thickness={4}
                      sx={{
                        color: getScoreColor(score),
                        position: "absolute",
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={40}
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
                          fontSize: "0.6rem",
                          fontFamily: '"Press Start 2P"',
                        }}
                      >
                        {Math.round(score)}%
                      </Typography>
                    </Box>
                  </ScoreCircle>

                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      mt: 1,
                      color: "var(--md-sys-color-on-surface-variant)",
                    }}
                  >
                    {new Date(submission.date_added).toLocaleDateString()}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "var(--md-sys-color-on-surface-variant)",
                    }}
                  >
                    by: {submission.username}
                  </Typography>
                </CardContent>
              </StyledCard>
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
