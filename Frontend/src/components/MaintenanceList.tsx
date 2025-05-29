import React from "react";
import { List, Typography, Divider } from "@mui/material";
import type { Maintenance } from "../types/types";
import MaintenanceListItem from "./MaintenanceListItem";

interface MaintenanceListProps {
  maintenances: Maintenance[];
  onEditMaintenance: (maintenanceId: string) => void;
  onDeleteMaintenance: (maintenanceId: string) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({
  maintenances,
  onEditMaintenance,
  onDeleteMaintenance,
}) => {
  if (maintenances.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Nenhuma manutenção registrada para este ativo.
      </Typography>
    );
  }

  return (
    <List>
      {maintenances.map((maint, index) => (
        <React.Fragment key={maint.id}>
          <MaintenanceListItem
            maintenance={maint}
            onEditMaintenance={onEditMaintenance}
            onDeleteMaintenance={onDeleteMaintenance}
          />
          {index < maintenances.length - 1 && (
            <Divider component="li" sx={{ my: 1 }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default MaintenanceList;
