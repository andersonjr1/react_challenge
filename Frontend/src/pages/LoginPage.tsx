import React, { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router"; // Renamed Link to avoid conflict
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Link as MuiLink, // MUI Link
  Grid,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext"; // Import UserContext

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao tentar login.");
      }

      // Assuming API returns id, name, email
      userCtx.login({ id: data.id, name: data.name, email: data.email });
      navigate("/dashboard"); // Or any other page after successful login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLoginSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && error.toLowerCase().includes("email")} // Example: highlight if error mentions email
            helperText={
              !!error && error.toLowerCase().includes("email") ? error : ""
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error && error.toLowerCase().includes("senha")} // Example: highlight if error mentions password
            helperText={
              !!error && error.toLowerCase().includes("senha") ? error : ""
            }
          />
          {error &&
            !error.toLowerCase().includes("email") &&
            !error.toLowerCase().includes("senha") && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Entrar"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid>
              <MuiLink component={RouterLink} to="/register" variant="body2">
                Não tem uma conta? Criar Conta
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
