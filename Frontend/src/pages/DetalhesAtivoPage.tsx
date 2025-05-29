import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // Use react-router-dom for useNavigate
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";

import type { Asset, Maintenance, AssetWithMaintenances } from "../types/types"; // Adjust path if necessary
import AssetDetailHeader from "../components/AssetDetailHeader";
import AssetInformation from "../components/AssetInformation";
import MaintenanceList from "../components/MaintenanceList";
import ConfirmationDialog from "../components/ConfirmationDialog"; // Already exists, ensure it's used

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

const DetalhesAtivoPage: React.FC = () => {
  const { ativoId } = useParams<{ ativoId: string }>();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const userCtx = React.useContext(UserContext);

  useEffect(() => {
    if (!userCtx.isLoggedIn) {
      navigate("/login");
    }
  }, [userCtx.isLoggedIn, navigate]);
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
        <AssetDetailHeader
          title="Detalhes"
          onAddMaintenanceClick={handleCreateMaintenance}
          addMaintenanceDisabled={!ativoId}
        />

        <AssetInformation
          assetName={asset.name}
          assetDescription={asset.description}
          onEditAssetClick={handleEditAsset}
          editAssetDisabled={!ativoId}
        />

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" component="h3" gutterBottom>
          Manutenções Realizadas e Pendentes
        </Typography>
        <MaintenanceList
          maintenances={asset.maintenances}
          onEditMaintenance={handleEditMaintenance}
          onDeleteMaintenance={handleOpenDeleteDialog}
        />
      </Paper>
      {/* Confirmation Dialog for Deleting Maintenance */}
      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteMaintenance}
        title="Confirmar Exclusão de Manutenção"
        contentText="Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Container>
  );
};

export default DetalhesAtivoPage;
