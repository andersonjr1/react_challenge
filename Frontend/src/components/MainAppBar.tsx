import React, { useState, useContext } from "react"; // Added useContext
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext"; // Import UserContext

const API_BASE_URL = "http://localhost:3000/api"; // Sua URL base da API

const MainAppBar: React.FC = () => {
  const navigate = useNavigate();
  const [loadingLogout, setLoadingLogout] = useState<boolean>(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const userCtx = useContext(UserContext); // Get UserContext
  const { logout } = userCtx; // Destructure isLoggedIn and logout from context
  const handleLogout = async () => {
    setLoadingLogout(true);
    setLogoutError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Se precisar de token para logout, adicione aqui
          // 'Authorization': `Bearer ${seuTokenDeAutenticacao}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao fazer logout.");
      }

      // Call UserContext logout function after successful API call
      logout();
      localStorage.removeItem("user");
      navigate("/login"); // Redireciona para a página de login
    } catch (err) {
      setLogoutError(
        err instanceof Error ? err.message : "Ocorreu um erro ao fazer logout."
      );
      console.error("Logout error:", err);
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Only render the AppBar if the user is logged in
  if (!localStorage.getItem("user")) {
    return null;
  }

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gerenciamento de Ativos
        </Typography>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="navigation menu"
            aria-controls="menu-appbar-nav"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar-nav"
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
            <MenuItem
              onClick={handleCloseNavMenu}
              component={RouterLink}
              to="/"
            >
              <DashboardIcon sx={{ mr: 1 }} />
              <Typography textAlign="center">Dashboard</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleCloseNavMenu}
              component={RouterLink}
              to="/ativos"
            >
              <ListAltIcon sx={{ mr: 1 }} />
              <Typography textAlign="center">Lista de Ativos</Typography>
            </MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<DashboardIcon />}
            sx={{ mx: 1 }}
          >
            Dashboard Manutenções
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/ativos"
            startIcon={<ListAltIcon />}
            sx={{ mx: 1 }}
          >
            Lista de Ativos
          </Button>
        </Box>

        <Box sx={{ ml: { xs: 0, md: 2 } }}>
          <Tooltip title="Sair (Logout)">
            <IconButton
              color="inherit"
              onClick={handleLogout}
              disabled={loadingLogout}
            >
              {loadingLogout ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <LogoutIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      {logoutError && (
        <Alert severity="error" sx={{ width: "100%", borderRadius: 0 }}>
          {logoutError}
        </Alert>
      )}
    </AppBar>
  );
};

export default MainAppBar;
