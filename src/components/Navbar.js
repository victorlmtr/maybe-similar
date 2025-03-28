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
  fontFamily: '"Press Start 2P"',
});

const LogoImage = styled("img")({
  height: "32px",
  width: "32px",
  marginRight: "12px",
});

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
});

const LogoText = styled(Typography)({
  fontFamily: '"Press Start 2P"',
  fontSize: "0.9rem",
  color: "var(--md-sys-color-on-surface)",
  display: "inline",
});

const DomainText = styled("a")({
  fontFamily: '"Press Start 2P"',
  fontSize: "0.9rem",
  color: "var(--md-sys-color-on-surface)",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

const AppText = styled(Link)({
  fontFamily: '"Press Start 2P"',
  fontSize: "0.9rem",
  color: "var(--md-sys-color-on-surface)",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <LogoContainer>
          <LogoImage src="/maybe-similar/logo192.png" alt="MaybeSimilar Logo" />
          <Box>
            <DomainText href="https://victorl.xyz">victorl.xyz</DomainText>
            <LogoText>/</LogoText>
            <AppText to="/">MaybeSimilar</AppText>
          </Box>
        </LogoContainer>
        <Box>
          <StyledButton component={Link} to="/">
            Home
          </StyledButton>
          <StyledButton component={Link} to="/add-suggestion">
            Add Suggestion
          </StyledButton>
          <StyledButton
            component="a"
            href="https://victorl.xyz/dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </StyledButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
