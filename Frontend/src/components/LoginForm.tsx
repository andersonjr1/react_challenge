import React from "react";
import { Link as RouterLink } from "react-router";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link as MuiLink,
  Grid,
} from "@mui/material";

interface LoginFormProps {
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
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
        onChange={onEmailChange}
        error={!!error && error.toLowerCase().includes("email")}
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
        onChange={onPasswordChange}
        error={!!error && error.toLowerCase().includes("senha")}
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
  );
};

export default LoginForm;
