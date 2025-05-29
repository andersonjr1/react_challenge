import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // Use react-router-dom for useNavigate
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";

import { UserContext } from "../contexts/UserContext";
import type { NewAssetData } from "../types/types"; // Import the interface

const API_BASE_URL = "http://localhost:3000/api"; // Substitua pelo seu IP/domínio real

const CriarAtivoPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Para o estado de salvar
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Função para lidar com o envio do formulário de criação
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validação: pelo menos um campo (nome ou descrição) deve ser preenchido
    if (!name.trim() && !description.trim()) {
      setError(
        "Pelo menos o Nome ou a Descrição do ativo deve ser preenchido."
      );
      setLoading(false);
      return;
    }

    const newAssetData: NewAssetData = {
      name: name.trim(),
      description: description.trim(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/ativos`, {
        method: "POST", // Método POST para criação
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssetData),
        credentials: "include", // Inclui cookies, se necessário para autenticação
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao criar o ativo.");
      }

      //   const createdAsset = await response.json(); // Opcional: capturar o ativo criado se a API retornar

      setSuccess("Ativo criado com sucesso!");
      // Opcional: Redirecionar após um pequeno atraso para o usuário ver a mensagem de sucesso
      // Pode redirecionar para a lista de ativos ou para a página de detalhes do novo ativo
      setTimeout(() => {
        // Exemplo: redireciona para a lista de ativos
        navigate(-1);
        // Exemplo: redireciona para o histórico do ativo recém-criado (se a API retornar o ID)
        // if (createdAsset && createdAsset.id) {
        //   navigate(`/ativos/${createdAsset.id}/historico`);
        // } else {
        //   navigate("/ativos"); // Fallback
        // }
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro desconhecido ao salvar."
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o cancelamento
  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior (geralmente a lista de ativos)
  };

  // Não há estado de initialLoading para criação
  const userCtx = React.useContext(UserContext);

  useEffect(() => {
    if (!userCtx.isLoggedIn) {
      navigate("/login");
    }
  }, [userCtx.isLoggedIn]);

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Criar Novo Ativo
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Ativo"
            name="name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!name.trim() && !description.trim() && !!error} // Destaca se ambos estiverem vazios e houver erro
            helperText={
              !name.trim() && !description.trim() && !!error
                ? "Nome ou Descrição são obrigatórios."
                : ""
            }
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Descrição Detalhada (Modelo, Placa, Localização etc.)"
            name="description"
            autoComplete="off"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!name.trim() && !description.trim() && !!error} // Destaca se ambos estiverem vazios e houver erro
            helperText={
              !name.trim() && !description.trim() && !!error
                ? "Nome ou Descrição são obrigatórios."
                : ""
            }
          />

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {" "}
              {/* Use item and xs/sm for Grid */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Criar Ativo"}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {" "}
              {/* Use item and xs/sm for Grid */}
              <Button
                fullWidth
                variant="outlined"
                sx={{ py: 1.5 }}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CriarAtivoPage;
