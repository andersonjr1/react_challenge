import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // Use react-router-dom for useNavigate
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button, // Import Button for "Editar Ativo"
  IconButton, // Import IconButton for "Editar Manutenção"
  Dialog, // Import Dialog components for confirmation
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // Import EditIcon for the buttons
import AddIcon from "@mui/icons-material/Add"; // Import AddIcon for the create button
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon for the delete button
import { UserContext } from "../contexts/UserContext";

import type { Asset, Maintenance, AssetWithMaintenances } from "../types/types"; // Adjust path if necessary

// --- API call functions ---
const fetchAssetDetailsAPI = async (assetId: string): Promise<Asset> => {
  const response = await fetch(`http://localhost:3000/api/ativos/${assetId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Ativo com ID "${assetId}" não encontrado.`);
    }
    throw new Error("Falha ao buscar detalhes do ativo.");
  }
  return response.json();
};

const fetchAssetMaintenancesAPI = async (
  assetId: string
): Promise<Maintenance[]> => {
  const response = await fetch(
    `http://localhost:3000/api/ativos/${assetId}/manutencoes`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Falha ao buscar manutenções do ativo.");
  }
  return response.json();
};

const deleteMaintenanceAPI = async (
  assetId: string,
  maintenanceId: string
): Promise<void> => {
  const response = await fetch(
    `http://localhost:3000/api/manutencoes/${maintenanceId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Manutenção com ID "${maintenanceId}" não encontrada para o ativo "${assetId}".`
      );
    }
    throw new Error("Falha ao deletar manutenção.");
  }
  // DELETE requests usually return 204 No Content, so no JSON to parse
};

const HistoricoAtivoPage: React.FC = () => {
  const { ativoId } = useParams<{ ativoId: string }>();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const userCtx = React.useContext(UserContext);

  useEffect(() => {
    if (!userCtx.isLoggedIn) {
      navigate("/login");
    }
  }, [userCtx.isLoggedIn]);
  const [asset, setAsset] = useState<AssetWithMaintenances | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [maintenanceToDeleteId, setMaintenanceToDeleteId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!ativoId) {
      setError("ID do ativo não fornecido na rota.");
      setLoading(false);
      return;
    }

    const loadAssetHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Buscar detalhes do ativo e manutenções em paralelo
        const [assetDetails, maintenancesData] = await Promise.all([
          fetchAssetDetailsAPI(ativoId),
          fetchAssetMaintenancesAPI(ativoId),
        ]);

        // Ordenar manutenções por data prevista
        const sortedMaintenances = (maintenancesData || []).sort(
          (a, b) =>
            new Date(a.expected_at).getTime() -
            new Date(b.expected_at).getTime()
        );

        setAsset({ ...assetDetails, maintenances: sortedMaintenances });
      } catch (err) {
        console.error("Erro ao buscar detalhes do ativo:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao carregar detalhes do ativo. Tente novamente.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadAssetHistory();
  }, [ativoId]); // Re-run effect if ativoId changes

  // Handler for editing the asset
  const handleEditAsset = () => {
    if (ativoId) {
      navigate(`/ativos/${ativoId}/editar`);
    }
  };

  // Handler for editing a specific maintenance
  const handleEditMaintenance = (maintenanceId: string) => {
    if (ativoId && maintenanceId) {
      navigate(`/ativos/${ativoId}/manutencoes/${maintenanceId}/editar`);
    }
  };

  // Handler for creating a new maintenance
  const handleCreateMaintenance = () => {
    if (ativoId) {
      navigate(`/ativos/${ativoId}/manutencoes/criar`);
    }
  };

  // Handler for opening the delete confirmation dialog
  const handleOpenDeleteDialog = (maintenanceId: string) => {
    setMaintenanceToDeleteId(maintenanceId);
    setOpenDeleteDialog(true);
  };

  // Handler for closing the delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setMaintenanceToDeleteId(null);
  };

  // Handler for confirming and executing maintenance deletion
  const handleConfirmDeleteMaintenance = async () => {
    if (!ativoId || !maintenanceToDeleteId) {
      setError("ID do ativo ou da manutenção ausente para exclusão.");
      handleCloseDeleteDialog();
      return;
    }

    try {
      await deleteMaintenanceAPI(ativoId, maintenanceToDeleteId);
      setAsset((prevAsset) => {
        if (!prevAsset) return null;
        return {
          ...prevAsset,
          maintenances: prevAsset.maintenances.filter(
            (m) => m.id !== maintenanceToDeleteId
          ),
        };
      });
      // Optionally, add a success notification here (e.g., using a Snackbar)
    } catch (err) {
      console.error("Erro ao deletar manutenção:", err);
      if (err instanceof Error) {
        setError(`Falha ao deletar manutenção: ${err.message}`);
      } else {
        setError("Ocorreu um erro desconhecido ao deletar a manutenção.");
      }
    } finally {
      handleCloseDeleteDialog();
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Carregando detalhes do ativo...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!asset) {
    // This case should ideally be caught by the error state above,
    // but as a fallback:
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Ativo não encontrado.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Detalhes
          </Typography>
          <Button
            variant="contained" // Use contained for primary action
            startIcon={<AddIcon />}
            onClick={handleCreateMaintenance}
            disabled={!ativoId}
          >
            Manutenção
          </Button>
        </Box>

        {/* Asset Details and Edit Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom color="primary">
            Ativo: {asset.name}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditAsset}
            disabled={!ativoId}
          >
            Editar Ativo
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          {asset.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" component="h3" gutterBottom>
          Manutenções Realizadas e Pendentes
        </Typography>

        {asset.maintenances.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhuma manutenção registrada para este ativo.
          </Typography>
        ) : (
          <List>
            {asset.maintenances.map((maint, index) => (
              <React.Fragment key={maint.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit maintenance"
                        onClick={() => handleEditMaintenance(maint.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete maintenance"
                        onClick={() => handleOpenDeleteDialog(maint.id)}
                        sx={{ ml: 1 }} // Add margin to separate from edit icon
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center", // Align items vertically in the middle
                        }}
                      >
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="text.primary"
                        >
                          {maint.service}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color={maint.done ? "success.main" : "warning.main"}
                          sx={{ ml: 2 }} // Add some left margin for separation
                        >
                          {maint.done ? "Realizada" : "Pendente"}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: "block" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          Descrição: {maint.description || "N/A"}
                        </Typography>
                        <Typography
                          sx={{ display: "block" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          Prevista para:{" "}
                          {new Date(maint.expected_at).toLocaleDateString()}
                        </Typography>
                        {maint.performed_at && (
                          <Typography
                            sx={{ display: "block" }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Realizada em:{" "}
                            {new Date(maint.performed_at).toLocaleDateString()}
                          </Typography>
                        )}
                        {maint.condition_next_maintenance && (
                          <Typography
                            sx={{ display: "block" }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Próxima Condição: {maint.condition_next_maintenance}
                          </Typography>
                        )}
                        {maint.date_next_maintenance && (
                          <Typography
                            sx={{ display: "block" }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Próxima Data:{" "}
                            {new Date(
                              maint.date_next_maintenance
                            ).toLocaleDateString()}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < asset.maintenances.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      {/* Confirmation Dialog for Deleting Maintenance */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Exclusão de Manutenção"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir esta manutenção? Esta ação não pode
            ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleConfirmDeleteMaintenance}
            color="error"
            autoFocus
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoricoAtivoPage;
