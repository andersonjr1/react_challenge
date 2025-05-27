import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Asset } from "../types/types";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { UserContext } from "../contexts/UserContext";

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

      {assets.length === 0 ? (
        <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 4 }}>
          Nenhum ativo encontrado. Comece adicionando um novo!
        </Typography>
      ) : (
        <List
          sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}
        >
          {assets.map((asset, index) => (
            <React.Fragment key={asset.id}>
              <ListItem>
                <ListItemText
                  primary={asset.name}
                  secondary={asset.description || "Sem descrição"}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Ver Detalhes/Histórico">
                    <IconButton
                      edge="end"
                      aria-label="details"
                      onClick={() => handleViewDetails(asset.id)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar Ativo">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      sx={{ ml: 1 }}
                      onClick={() => handleEditAsset(asset.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remover Ativo">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      sx={{ ml: 1 }}
                      onClick={() => handleDeleteClick(asset.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              {index < assets.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Exclusão"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja remover este ativo? Esta ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Remover"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListaAtivosPage;
