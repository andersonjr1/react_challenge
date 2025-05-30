import React from "react";
import { List, ListItemText } from "@mui/material";
import type { Maintenance } from "../types/types";
import DashboardMaintenanceItem from "./DashboardMaintenanceItem";

interface DashboardPendingMaintenanceListProps {
  maintenances: Maintenance[];
  assetId: string;
  onEditMaintenance: (assetId: string, maintenanceId: string) => void;
  onMarkMaintenanceAsDone: (maintenanceId: string) => void;
}

const DashboardPendingMaintenanceList: React.FC<
  DashboardPendingMaintenanceListProps
> = ({ maintenances, assetId, onEditMaintenance, onMarkMaintenanceAsDone }) => {
  if (maintenances.length === 0) {
    return (
      <ListItemText
        primary="Nenhuma manutenção pendente."
        sx={{ textAlign: "center", color: "text.secondary", py: 2 }} // Added padding
      />
    );
  }

  return (
    <List dense sx={{ height: "120px", overflowY: "auto", p: 0 }}>
      {" "}
      {/* Ensure padding is 0 if items handle it */}
      {maintenances.map((maintenance) => (
        <DashboardMaintenanceItem
          key={maintenance.id}
          maintenance={maintenance}
          assetId={assetId}
          onEditClick={onEditMaintenance}
          onMarkAsDoneClick={onMarkMaintenanceAsDone}
        />
      ))}
    </List>
  );
};

export default DashboardPendingMaintenanceList;
