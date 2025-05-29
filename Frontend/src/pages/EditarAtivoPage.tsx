import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import type { Asset } from "../types/types"; // Import the Asset interface
import AssetForm from "../components/AssetForm"; // Import the new AssetForm component

const API_BASE_URL = "http://localhost:3000/api"; // Substitua pelo seu IP/domínio real

const EditarAtivoPage: React.FC = () => {
  const { ativoId } = useParams<{ ativoId: string }>(); // Obtém o ID do ativo da URL
  const navigate = useNavigate();

  const userCtx = React.useContext(UserContext);

  useEffect(() => {
    if (!userCtx.isLoggedIn) {
      navigate("/login");
    }
  }, [userCtx.isLoggedIn]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Para o estado de salvar
  const [initialLoading, setInitialLoading] = useState<boolean>(true); // Para carregar os dados iniciais
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Função para buscar os dados do ativo existente
  useEffect(() => {
    const fetchAssetData = async () => {
      if (!ativoId) {
        setError("ID do ativo não fornecido na URL.");
        setInitialLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/ativos/${ativoId}`, {
          credentials: "include",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Falha ao carregar os dados do ativo."
          );
        }
        const data: Asset = await response.json();
        setName(data.name);
        setDescription(data.description || ""); // Garante que a descrição não seja nula
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar ativo."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAssetData();
  }, [ativoId]); // Recarrega se o ID do ativo mudar

  // Função para lidar com o envio do formulário de edição
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

    try {
      const response = await fetch(`${API_BASE_URL}/ativos/${ativoId}`, {
        method: "PUT", // Ou 'PATCH', dependendo da sua API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao atualizar o ativo.");
      }

      setSuccess("Ativo atualizado com sucesso!");
      // Opcional: Redirecionar após um pequeno atraso para o usuário ver a mensagem de sucesso
      setTimeout(() => {
        navigate(-1); // Ou para a página de detalhes do ativo
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
    navigate(-1); // Volta para a página anterior
  };

  if (initialLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Carregando dados do ativo...
        </Typography>
      </Box>
    );
  }

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
          Editar Ativo
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
          submitButtonText="Salvar Alterações"
          // Pass error messages for individual fields if needed,
          // or rely on the general error Alert above the form.
          // For example, if you had specific validation for 'name':
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

export default EditarAtivoPage;
