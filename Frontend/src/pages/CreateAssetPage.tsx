import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // Use react-router-dom for useNavigate
import { Container, Box, Typography, Alert } from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import type { NewAssetData } from "../types/types"; // Import the interface
import AssetForm from "../components/AssetForm"; // Import the reusable AssetForm

const API_BASE_URL = "http://localhost:3000/api"; // Substitua pelo seu IP/domínio real

const CreateAssetPage: React.FC = () => {
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
  }, [userCtx.isLoggedIn, navigate]);

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

        <AssetForm
          name={name}
          onNameChange={(e) => setName(e.target.value)}
          description={description}
          onDescriptionChange={(e) => setDescription(e.target.value)}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          submitButtonText="Criar Ativo"
          // Pass error messages for individual fields if needed,
          // or rely on the general error Alert above the form.
          // The existing logic for error/helperText on TextFields was tied to the general 'error' state.
          nameError={
            !name.trim() && !description.trim() && error ? error : undefined
          }
          descriptionError={
            !name.trim() && !description.trim() && error ? error : undefined
          }
        />
      </Box>
    </Container>
  );
};

export default CreateAssetPage;
