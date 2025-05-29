import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Asset } from "../types/types";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { UserContext } from "../contexts/UserContext";
import AssetList from "../components/AssetList"; // Import the new AssetList component
import ConfirmationDialog from "../components/ConfirmationDialog"; // Import the new ConfirmationDialog component

const API_BASE_URL = "http://localhost:3000/api"; // Sua URL base da API

const ListaAtivosPage: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  // Função para buscar a lista de ativos
  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/ativos`, {
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao carregar os ativos.");
      }
      const data: Asset[] = await response.json();
      setAssets(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao carregar os ativos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []); // Executa apenas uma vez ao montar o componente

  const userCtx = React.useContext(UserContext);

  useEffect(() => {
    if (!userCtx.isLoggedIn) {
      navigate("/login");
    }
  }, [userCtx.isLoggedIn]);

  // Funções de navegação e ação
  const handleAddAsset = () => {
    navigate("/ativos/criar");
  };

  const handleEditAsset = (assetId: string) => {
    navigate(`/ativos/${assetId}/editar`);
  };

  const handleViewDetails = (assetId: string) => {
    navigate(`/ativos/${assetId}/detalhes`);
  };

  const handleDeleteClick = (assetId: string) => {
    setAssetToDelete(assetId);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/ativos/${assetToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao remover o ativo.");
      }

      // Se a exclusão for bem-sucedida, atualize a lista de ativos
      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset.id !== assetToDelete)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao remover o ativo."
      );
    } finally {
      setLoading(false);
      setDeleteConfirmationOpen(false);
      setAssetToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setAssetToDelete(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Carregando ativos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Meus Ativos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAsset}
        >
          Adicionar Novo Ativo
        </Button>
      </Box>

      <AssetList
        assets={assets}
        onViewDetails={handleViewDetails}
        onEditAsset={handleEditAsset}
        onDeleteAsset={handleDeleteClick} // This will now open the dialog
      />

      {/* Diálogo de Confirmação de Exclusão */}
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        contentText="Tem certeza de que deseja remover este ativo? Esta ação não pode ser desfeita."
        confirmText="Remover"
        isLoading={loading} // Pass loading state to disable buttons during operation
      />
    </Container>
  );
};

export default ListaAtivosPage;
