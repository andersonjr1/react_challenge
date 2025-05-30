import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import type { AssetWithMaintenances } from "../types/types";
import DashboardPendingMaintenanceList from "./DashboardPendingMaintenanceList";

interface DashboardAssetCardProps {
  asset: AssetWithMaintenances;
  onEditAssetClick: (assetId: string) => void;
  onViewAssetDetailsClick: (assetId: string) => void;
  onEditMaintenanceClick: (assetId: string, maintenanceId: string) => void;
  onMarkMaintenanceAsDoneClick: (maintenanceId: string) => void;
}

const DashboardAssetCard: React.FC<DashboardAssetCardProps> = ({
  asset,
  onEditAssetClick,
  onViewAssetDetailsClick,
  onEditMaintenanceClick,
  onMarkMaintenanceAsDoneClick,
}) => {
  const pendingMaintenances = asset.maintenances
    .filter((m) => !m.done)
    .sort(
      (a, b) =>
        new Date(a.expected_at).getTime() - new Date(b.expected_at).getTime()
    );

  return (
    <Card elevation={3}>
      <CardHeader
        title={asset.name}
        subheader={asset.description || "Sem descrição"}
        action={
          <Tooltip title="Editar Ativo">
            <IconButton
              onClick={() => onEditAssetClick(asset.id)}
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
        <DashboardPendingMaintenanceList
          maintenances={pendingMaintenances}
          assetId={asset.id}
          onEditMaintenance={onEditMaintenanceClick}
          onMarkMaintenanceAsDone={onMarkMaintenanceAsDoneClick}
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          size="small"
          startIcon={<InfoIcon />}
          onClick={() => onViewAssetDetailsClick(asset.id)}
        >
          Detalhes do ativo
        </Button>
      </CardActions>
    </Card>
  );
};

export default DashboardAssetCard;
