import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Home as HomeIcon,
  Add as AddIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";

// Move styled components here
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "var(--md-sys-color-surface-container)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: "space-between",
});

const TitleContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
}));

const TitleLink = styled("a")(({ theme }) => ({
  fontFamily: '"Press Start 2P"',
  color: "var(--md-sys-color-on-surface)",
  textDecoration: "none",
  fontSize: "1rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
  "&:hover": {
    opacity: 0.8,
  },
}));

const TitleSeparator = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P"',
  color: "var(--md-sys-color-on-surface)",
  opacity: 0.5,
  fontSize: "1rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
}));

const NavButton = styled(Button)(({ theme }) => ({
  fontFamily: '"Press Start 2P"',
  fontSize: "0.7rem",
  color: "var(--md-sys-color-on-surface)",
  "&:hover": {
    backgroundColor: "var(--md-sys-color-surface-container-high)",
  },
}));

const NavIconButton = styled(IconButton)(({ theme }) => ({
  color: "var(--md-sys-color-on-surface)",
  "&:hover": {
    backgroundColor: "var(--md-sys-color-surface-container-high)",
  },
}));

// Add export statement here
export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isActive = (path) => location.pathname === path;

  const renderNavItems = () => {
    if (isMobile) {
      return (
        <ButtonContainer>
          <NavIconButton
            onClick={() => navigate("/")}
            color={isActive("/") ? "primary" : "default"}
          >
            <HomeIcon />
          </NavIconButton>
          <NavIconButton
            onClick={() => navigate("/add-suggestion")}
            color={isActive("/add-suggestion") ? "primary" : "default"}
          >
            <AddIcon />
          </NavIconButton>
          <NavIconButton
            component="a"
            href="https://github.com/victorlmtv/maybe-similar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </NavIconButton>
        </ButtonContainer>
      );
    }

    return (
      <ButtonContainer>
        <NavButton
          onClick={() => navigate("/")}
          variant={isActive("/") ? "contained" : "text"}
        >
          Home
        </NavButton>
        <NavButton
          onClick={() => navigate("/add-suggestion")}
          variant={isActive("/add-suggestion") ? "contained" : "text"}
        >
          Add Suggestion
        </NavButton>
        <NavButton
          component="a"
          href="https://github.com/victorlmtv/maybe-similar"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<GitHubIcon />}
        >
          GitHub
        </NavButton>
      </ButtonContainer>
    );
  };

  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <TitleContainer>
          <TitleLink href="https://victorl.xyz">victorl.xyz</TitleLink>
          {!isMobile && (
            <>
              <TitleSeparator>/</TitleSeparator>
              <TitleLink href="https://victorl.xyz/maybe-similar">
                MaybeSimilar
              </TitleLink>
            </>
          )}
        </TitleContainer>
        {renderNavItems()}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
