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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // Import EditIcon for the buttons
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

const HistoricoAtivoPage: React.FC = () => {
  const { ativoId } = useParams<{ ativoId: string }>();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [asset, setAsset] = useState<AssetWithMaintenances | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        console.error("Erro ao buscar histórico do ativo:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao carregar histórico do ativo. Tente novamente.");
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
          Carregando histórico do ativo...
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
            Histórico de Manutenções
          </Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditAsset}
            disabled={!ativoId} // Disable if ativoId is not available
          >
            Editar Ativo
          </Button>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom color="primary">
          Ativo: {asset.name}
        </Typography>
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
                    <IconButton
                      edge="end"
                      aria-label="edit maintenance"
                      onClick={() => handleEditMaintenance(maint.id)}
                    >
                      <EditIcon />
                    </IconButton>
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
    </Container>
  );
};

export default HistoricoAtivoPage;
