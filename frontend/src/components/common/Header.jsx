import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { logout } from '../../redux/slices/authSlice';

// Logo temporário, você deve criar um arquivo de verdade posteriormente
const logoPlaceholder = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20fill%3D%22%235D4037%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3Ctext%20fill%3D%22%23FFFFFF%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2220%22%20x%3D%2222%22%20y%3D%2255%22%3EDAMAS%3C%2Ftext%3E%3C%2Fsvg%3E';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleDashboard = () => {
    handleClose();
    navigate('/dashboard');
  };

  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        <ListItem component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
          <Box
            component="img"
            src={logoPlaceholder}
            alt="Damas Online"
            sx={{ height: 40, mr: 1 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Damas Online
          </Typography>
        </ListItem>
        <Divider sx={{ my: 2 }} />
        {isAuthenticated ? (
          <>
            <ListItem button component={RouterLink} to="/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Painel" />
            </ListItem>
            <ListItem button component={RouterLink} to="/profile">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Perfil" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={RouterLink} to="/login">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Entrar" />
            </ListItem>
            <ListItem button component={RouterLink} to="/register">
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Registrar" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ boxShadow: 3 }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexGrow: isMobile ? 1 : 0 }}>
          <Box
            component="img"
            src={logoPlaceholder}
            alt="Damas Online"
            sx={{ height: 40, mr: 1, display: { xs: 'none', sm: 'block' } }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Damas Online
          </Typography>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', mx: 4 }}>
            <Button color="inherit" component={RouterLink} to="/" sx={{ mx: 1 }}>
              Início
            </Button>
            {isAuthenticated && (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard" sx={{ mx: 1 }}>
                  Jogar
                </Button>
                <Button color="inherit" component={RouterLink} to="/leaderboard" sx={{ mx: 1 }}>
                  Ranking
                </Button>
              </>
            )}
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated ? (
          <>
            <IconButton color="inherit" onClick={handleMenu}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Perfil</MenuItem>
              <MenuItem onClick={handleDashboard}>Painel</MenuItem>
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </>
        ) : (
          !isMobile && (
            <Box>
              <Button color="inherit" component={RouterLink} to="/login" sx={{ mx: 1 }}>
                Entrar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/register"
                sx={{ mx: 1 }}
              >
                Registrar
              </Button>
            </Box>
          )
        )}
      </Toolbar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawerList}
      </Drawer>
    </AppBar>
  );
};

export default Header;