// reference: starter from https://mui.com/material-ui/react-app-bar/
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Avatar,
  Button,
  Tooltip,
  Typography,
  MenuItem,
  Menu,
  Container,
} from "@mui/material";
import { useMode, useUser } from "../providers";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Logout from '@mui/icons-material/Logout';
import "../App.css";

const pages = [
  {
    name: "Main Feed",
    link: "/main",
  },
  {
    name: "Browse Courses",
    link: "/browse-courses",
  },
  {
    name: "Contact",
    link: "/contact",
  },
  {
    name: "FAQ",
    link: "/faq",
  },
];

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, toggleMode } = useMode();
  const { user: currentUser, removeUser} = useUser();
  const { firstName, lastName } = currentUser;

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const hideNavBarOnPaths = ['/', '/login', '/register'];

  if (hideNavBarOnPaths.includes(location.pathname)) {
    // hide the NavBar on landing, login and register pages
    return null;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutOnClick = () => {
    localStorage.setItem("currentUser", null);
    setAnchorElUser(null);
    removeUser();
    navigate("/");
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters variant="dense">
          <Typography
            variant="h3"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            DalCSHub
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => { 
                    navigate(`..${page.link}`);
                    setAnchorElNav(null);
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h3"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            DalCSHub
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(`..${page.link}`)}
                sx={{
                  my: 1,
                  color: "white",
                  display: "block",
                  fontFamily: "Helvetica Neue",
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Avatar Image">
                  {firstName[0]?.toUpperCase()}{lastName[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "32px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={'mode'} disableRipple>
                  {mode === 'light' ? "Light" : "Dark"} mode
                  <IconButton sx={{ ml: 1 }} onClick={toggleMode} color="inherit">
                      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
              </MenuItem>
              <MenuItem key={'logout'} onClick={logoutOnClick}>        
                  Log out
                  <Logout sx={{ ml: 6.2 }} fontSize="small" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
