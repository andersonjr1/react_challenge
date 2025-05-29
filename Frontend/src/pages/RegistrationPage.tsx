import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // Corrected import
import { Container, Box, Typography } from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import RegistrationForm from "../components/RegistrationForm"; // Import the new component

const RegistrationPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userCtx = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleRegistrationSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao tentar registrar.");
      }

      // Optional: You could show a success message here before navigating
      // For example, using a Snackbar from MUI
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido. Tente novamente.");
      }
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userCtx.isLoggedIn) {
      navigate("/");
    }
  }, [userCtx.isLoggedIn]);

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
          Criar Conta
        </Typography>
        <RegistrationForm
          name={name}
          onNameChange={(e) => setName(e.target.value)}
          email={email}
          onEmailChange={(e) => setEmail(e.target.value)}
          password={password}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleRegistrationSubmit}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Container>
  );
};

export default RegistrationPage;
