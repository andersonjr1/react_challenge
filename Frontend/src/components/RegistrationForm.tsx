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

interface RegistrationFormProps {
  name: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  name,
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{ mt: 3 }} // Increased top margin for the form
    >
      <TextField
        autoComplete="name"
        margin="normal"
        name="name"
        required
        fullWidth
        id="name"
        label="Nome Completo"
        autoFocus
        value={name}
        onChange={onNameChange}
      />
      <TextField
        required
        fullWidth
        margin="normal"
        id="email"
        label="E-mail"
        name="email"
        autoComplete="email"
        value={email}
        onChange={onEmailChange}
      />
      <TextField
        required
        fullWidth
        margin="normal"
        name="password"
        label="Senha"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={onPasswordChange}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
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
        {isLoading ? <CircularProgress size={24} /> : "Cadastrar"}
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid>
          <MuiLink component={RouterLink} to="/login" variant="body2">
            Já tem uma conta? Faça login
          </MuiLink>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegistrationForm;
