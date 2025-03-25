import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "var(--md-sys-color-surface-container)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
});

const StyledButton = styled(Button)({
  color: "var(--md-sys-color-on-surface)",
  marginLeft: "1rem",
});

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontFamily: '"Press Start 2P"',
            fontSize: "1rem",
            color: "var(--md-sys-color-on-surface)",
          }}
        >
          MaybeSimilar?
        </Typography>
        <Box>
          <StyledButton component={Link} to="/">
            Home
          </StyledButton>
          <StyledButton component={Link} to="/add-suggestion">
            Add Suggestion
          </StyledButton>
          <StyledButton>Contact</StyledButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
