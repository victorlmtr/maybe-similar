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
import { ChevronRight, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const drawerWidth = 340;

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  justifyContent: "space-between",
  backgroundColor: "var(--md-sys-color-secondary-container)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
}));

const SongTitle = styled(Typography)({
  color: "var(--md-sys-color-on-surface)",
  fontSize: "0.9rem",
  fontFamily: "Roboto, sans-serif",
  lineHeight: 1.4,
  wordWrap: "break-word",
});

const VsDivider = styled(Typography)({
  fontFamily: '"Press Start 2P"',
  fontSize: "0.8rem",
  color: "var(--md-sys-color-on-surface)",
  margin: "0.5rem 0",
  textAlign: "center",
});

const StyledCard = styled(Card)(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? "var(--md-sys-color-surface-container-high)"
    : "var(--md-sys-color-surface-container)",
  marginBottom: "1rem",
  cursor: "pointer",
  padding: theme.spacing(1),
  border: isSelected ? "2px solid var(--md-sys-color-primary)" : "none",
  "&:hover": {
    backgroundColor: "var(--md-sys-color-surface-container-high)",
  },
}));

const ScoreCircle = styled(Box)({
  position: "relative",
  display: "inline-flex",
  margin: "0.5rem 0",
});

const ScoreContainer = styled(Box)({
  position: "absolute",
  bottom: 8,
  right: 8,
});

const CardContentStyled = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  padding: "8px !important",
  position: "relative",
  minHeight: "180px",
});

const getScoreColor = (score) => {
  if (score < 33) return "rgb(147, 0, 10)";
  if (score < 66) return "rgb(255, 176, 0)";
  return "rgb(46, 106, 68)";
};

const Sidebar = ({
  submissions,
  sortBy,
  onSortChange,
  currentPairId,
  isMobile,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

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

  const handleCardClick = (submission) => {
    navigate(`/?id=${submission.id}`);
  };

  const processedSubmissions = sortSubmissions(filterSubmissions(submissions));

  return (
    <Box
      sx={{
        position: isMobile ? "relative" : "fixed",
        right: isMobile ? "auto" : 0,
        top: isMobile ? "auto" : "64px",
        width: isMobile ? "100%" : drawerWidth,
        height: isMobile ? "auto" : "calc(100vh - 64px)",
        backgroundColor: "var(--md-sys-color-secondary-container)",
        borderLeft: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.12)",
        borderTop: isMobile ? "1px solid rgba(255, 255, 255, 0.12)" : "none",
        zIndex: 1,
        overflow: "auto",
      }}
    >
      <DrawerHeader>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Press Start 2P"', fontSize: "0.9rem" }}
        >
          Submissions
        </Typography>
      </DrawerHeader>

      <Box sx={{ p: 2 }}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} onChange={handleSortChange} label="Sort by">
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
      </Box>

      <Box sx={{ overflowY: "auto", height: "calc(100vh - 200px)" }}>
        {processedSubmissions.map((submission) => {
          const score =
            submission.similarVotes + submission.notSimilarVotes > 0
              ? (submission.similarVotes /
                  (submission.similarVotes + submission.notSimilarVotes)) *
                100
              : 0;

          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          };

          return (
            <StyledCard
              key={submission.id}
              onClick={() => handleCardClick(submission)}
              isSelected={submission.id === currentPairId}
            >
              <CardContentStyled>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <SongTitle>{submission.video1.songName}</SongTitle>
                  <VsDivider>VS.</VsDivider>
                  <SongTitle>{submission.video2.songName}</SongTitle>
                </Box>

                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "var(--md-sys-color-on-surface-variant)",
                    fontFamily: "Roboto, sans-serif",
                    mt: "auto",
                    textAlign: "center",
                  }}
                >
                  by {submission.username}
                  <br />
                  {formatDate(submission.date_added)}
                </Typography>

                <ScoreContainer>
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
                </ScoreContainer>
              </CardContentStyled>
            </StyledCard>
          );
        })}
      </Box>
    </Box>
  );
};

export default Sidebar;
