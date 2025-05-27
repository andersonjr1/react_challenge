// src/components/AssetMaintenanceDashboard.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  IconButton,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DetailsIcon from "@mui/icons-material/Details";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy"; // Overdue
import EventNoteIcon from "@mui/icons-material/EventNote"; // Scheduled
import UpdateIcon from "@mui/icons-material/Update"; // Upcoming soon

import type {
  AssetWithMaintenances,
  //   Maintenance,
  SortOption,
} from "../types/types";
import {
  fetchAssetsWithMaintenances,
  updateMaintenance as apiUpdateMaintenance,
} from "../services/apiService";
import { formatDate, getMaintenanceStatus } from "../utils/dateUtils";
import { useNavigate } from "react-router";

const AssetMaintenanceDashboard: React.FC = () => {
  const [assetsData, setAssetsData] = useState<AssetWithMaintenances[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("urgency");
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchData();
  }, []);
  //   const handleMarkAsDone = async (assetId: string, maintenanceId: string) => {
  const handleMarkAsDone = async (_: string, maintenanceId: string) => {
    // Optimistic update example (optional)
    // const originalAssetsData = [...assetsData];
    // setAssetsData(prevAssets => prevAssets.map(asset => asset.id === assetId ? {
    //   ...asset,
    //   maintenances: asset.maintenances.map(m => m.id === maintenanceId ? {...m, done: true, performed_at: new Date().toISOString()} : m)
    // } : asset ));

    try {
      await apiUpdateMaintenance(maintenanceId, {
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
      // Rollback optimistic update if it failed
      // setAssetsData(originalAssetsData);
    }
  };

  const sortedAndFilteredAssets = useMemo(() => {
    const processedAssets = [...assetsData];

    // Filter: Ensure only assets with relevant (undone) maintenances are shown
    // This filtering is now done in fetchAssetsWithMaintenances, but kept here as an example if needed client-side
    // processedAssets = processedAssets.filter(asset =>
    //   asset.maintenances.some(m => !m.done)
    // );

    // Sort
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
              <Card elevation={3}>
                <CardHeader
                  title={asset.name}
                  subheader={asset.description || "Sem descrição"}
                  action={
                    <Tooltip title="Editar Ativo">
                      <IconButton
                        onClick={() => navigate(`/ativos/${asset.id}/editar`)}
                        aria-label="edit asset"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Manutenções Pendentes:
                  </Typography>
                  <List dense sx={{ height: "120px", overflowY: "auto" }}>
                    {asset.maintenances
                      .filter((m) => !m.done) // Show only undone maintenances here
                      .sort(
                        (a, b) =>
                          new Date(a.expected_at).getTime() -
                          new Date(b.expected_at).getTime()
                      ) // Sort by date, all items will be rendered for scrolling
                      .map((maintenance) => {
                        const status = getMaintenanceStatus(
                          maintenance.expected_at,
                          maintenance.done
                        );
                        let StatusIcon = EventNoteIcon;
                        if (status.label === "Atrasada")
                          StatusIcon = EventBusyIcon;
                        else if (status.label.startsWith("Próxima"))
                          StatusIcon = UpdateIcon;

                        return (
                          <ListItem
                            key={maintenance.id}
                            secondaryAction={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 0.5,
                                  height: 100,
                                }}
                              >
                                <Tooltip title="Editar Manutenção">
                                  <IconButton
                                    size="small"
                                    edge="end"
                                    aria-label="edit maintenance"
                                    onClick={() =>
                                      navigate(
                                        `/ativos/${asset.id}/manutencoes/${maintenance.id}/editar`
                                      )
                                    }
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {!maintenance.done && (
                                  <Tooltip title="Marcar como Concluída">
                                    <IconButton
                                      size="small"
                                      edge="end"
                                      aria-label="mark as done"
                                      onClick={() =>
                                        handleMarkAsDone(
                                          asset.id,
                                          maintenance.id
                                        )
                                      }
                                    >
                                      <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            }
                            sx={{
                              pl: 0,
                              "&:hover": { backgroundColor: "action.hover" },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: "36px" }}>
                              <StatusIcon sx={{ color: status.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={maintenance.service}
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ display: "block" }}
                                  >
                                    Previsto:{" "}
                                    {formatDate(maintenance.expected_at)}
                                  </Typography>
                                  <Chip
                                    label={status.label}
                                    size="small"
                                    sx={{
                                      backgroundColor: status.color,
                                      color:
                                        status.color.includes("error") ||
                                        status.color.includes("warning")
                                          ? "#fff"
                                          : "inherit",
                                      mt: 0.5,
                                    }}
                                  />
                                </>
                              }
                              secondaryTypographyProps={{ component: "div" }}
                            />
                          </ListItem>
                        );
                      })}
                    {asset.maintenances.filter((m) => !m.done).length === 0 && (
                      <ListItemText
                        primary="Nenhuma manutenção pendente."
                        sx={{ textAlign: "center", color: "text.secondary" }}
                      />
                    )}
                  </List>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Button
                    size="small"
                    startIcon={<DetailsIcon />}
                    onClick={() => navigate(`/ativos/${asset.id}/detalhes`)} // Navigate to a page showing all maintenances
                  >
                    Detalhes do ativo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AssetMaintenanceDashboard;
