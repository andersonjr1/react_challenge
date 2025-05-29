import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { Container, Box, Typography } from "@mui/material";
import { UserContext } from "../contexts/UserContext"; // Import UserContext
import LoginForm from "../components/LoginForm"; // Import the new LoginForm component

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
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao tentar login.");
      }

      // Assuming API returns id, name, email
      userCtx.login({ id: data.id, name: data.name, email: data.email });

      localStorage.setItem(
        "user",
        JSON.stringify({ id: data.id, name: data.name, email: data.email })
      );

      navigate("/"); // Or any other page after successful login
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

  useEffect(() => {
    if (userCtx.isLoggedIn) {
      navigate("/");
    }
  }, [userCtx.isLoggedIn, navigate]);

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
        <LoginForm
          email={email}
          onEmailChange={(e) => setEmail(e.target.value)}
          password={password}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleLoginSubmit}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Container>
  );
};

export default LoginPage;
