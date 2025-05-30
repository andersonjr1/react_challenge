import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import type {
  AssetWithMaintenances,
  Maintenance,
  Asset,
  SortOption,
} from "../types/types";
import { useNavigate } from "react-router";
import DashboardAssetCard from "./DashboardAssetCard"; // Import the new component

const AssetMaintenanceDashboard: React.FC = () => {
  const [assetsData, setAssetsData] = useState<AssetWithMaintenances[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("urgency");
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3000/api";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssetsWithMaintenances();
      setAssetsData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
      );
    } finally {
      setLoading(false);
    }
  };

  async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido na API" }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json() as Promise<T>;
  }

  async function fetchAssets(): Promise<Asset[]> {
    const response = await fetch(`${API_BASE_URL}/ativos`, {
      credentials: "include",
    });
    return handleResponse<Asset[]>(response);
  }

  async function fetchMaintenancesForAsset(
    assetId: string
  ): Promise<Maintenance[]> {
    const response = await fetch(
      `${API_BASE_URL}/ativos/${assetId}/manutencoes`,
      { credentials: "include" }
    );
    return handleResponse<Maintenance[]>(response);
  }

  // Function to fetch assets and their maintenances, then combine them
  async function fetchAssetsWithMaintenances(): Promise<
    AssetWithMaintenances[]
  > {
    const assets = await fetchAssets();
    const assetsWithMaintenances: AssetWithMaintenances[] = await Promise.all(
      assets.map(async (asset) => {
        const maintenances = await fetchMaintenancesForAsset(asset.id);
        const undoneMaintenances = maintenances.filter((m) => !m.done);

        let mostRelevantDate: string | undefined = undefined;
        if (undoneMaintenances.length > 0) {
          // Sort by expected_at to find the earliest
          undoneMaintenances.sort(
            (a, b) =>
              new Date(a.expected_at).getTime() -
              new Date(b.expected_at).getTime()
          );
          mostRelevantDate = undoneMaintenances[0].expected_at;
        }

        return {
          ...asset,
          maintenances: maintenances, // Store all maintenances for history view
          mostRelevantMaintenanceDate: mostRelevantDate,
          hasUrgentOrUpcomingMaintenance: undoneMaintenances.length > 0, // Asset has any undone maintenance
        };
      })
    );
    // Filter out assets that don't have any upcoming/overdue maintenance
    return assetsWithMaintenances.filter(
      (a) => a.hasUrgentOrUpcomingMaintenance
    );
  }

  // Placeholder for future API calls
  async function updateMaintenance(
    maintenanceId: string,
    data: Partial<Maintenance>
  ): Promise<Maintenance> {
    const response = await fetch(
      `${API_BASE_URL}/manutencoes/${maintenanceId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );
    return handleResponse<Maintenance>(response);
  }

  useEffect(() => {
    fetchData();
  }, []);
  //   const handleMarkAsDone = async (assetId: string, maintenanceId: string) => {
  const handleMarkAsDone = async (_: string, maintenanceId: string) => {
    try {
      await updateMaintenance(maintenanceId, {
        done: true,
        performed_at: new Date().toISOString(),
      });
      // Refetch data to ensure consistency and reflect changes server-side
      // Or update state more granularly if preferred after successful API call
      fetchData();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Falha ao atualizar manutenção."
      );
    }
  };

  const handleEditAsset = (assetId: string) => {
    navigate(`/ativos/${assetId}/editar`);
  };

  const handleViewAssetDetails = (assetId: string) => {
    navigate(`/ativos/${assetId}/detalhes`);
  };

  const handleEditMaintenance = (assetId: string, maintenanceId: string) => {
    navigate(`/ativos/${assetId}/manutencoes/${maintenanceId}/editar`);
  };

  // handleMarkAsDone remains the same as it involves an API call

  const sortedAndFilteredAssets = useMemo(() => {
    const processedAssets = [...assetsData];
    processedAssets.sort((a, b) => {
      if (sortBy === "urgency") {
        const dateA = a.mostRelevantMaintenanceDate
          ? new Date(a.mostRelevantMaintenanceDate).getTime()
          : Infinity;
        const dateB = b.mostRelevantMaintenanceDate
          ? new Date(b.mostRelevantMaintenanceDate).getTime()
          : Infinity;
        return dateA - dateB; // Earliest dates first
      }
      if (sortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name_desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return processedAssets;
  }, [assetsData, sortBy]);

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
          Carregando ativos e manutenções...
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Painel de Manutenções de Ativos
      </Typography>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="sort-by-label">Ordenar Por</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            label="Ordenar Por"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <MenuItem value="urgency">
              Mais Próximas/Atrasadas Primeiro
            </MenuItem>
            <MenuItem value="name_asc">Nome do Ativo (A-Z)</MenuItem>
            <MenuItem value="name_desc">Nome do Ativo (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {sortedAndFilteredAssets.length === 0 ? (
        <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 4 }}>
          Nenhuma manutenção próxima ou atrasada encontrada.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sortedAndFilteredAssets.map((asset) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={asset.id}>
              <DashboardAssetCard
                asset={asset}
                onEditAssetClick={handleEditAsset}
                onViewAssetDetailsClick={handleViewAssetDetails}
                onEditMaintenanceClick={handleEditMaintenance}
                onMarkMaintenanceAsDoneClick={(maintenanceId) =>
                  handleMarkAsDone(asset.id, maintenanceId)
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
export default AssetMaintenanceDashboard;
