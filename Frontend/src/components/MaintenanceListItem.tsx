import React from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Maintenance } from "../types/types";

interface MaintenanceListItemProps {
  maintenance: Maintenance;
  onEditMaintenance: (maintenanceId: string) => void;
  onDeleteMaintenance: (maintenanceId: string) => void;
}

const MaintenanceListItem: React.FC<MaintenanceListItemProps> = ({
  maintenance,
  onEditMaintenance,
  onDeleteMaintenance,
}) => {
  return (
    <ListItem
      alignItems="flex-start"
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="edit maintenance"
            onClick={() => onEditMaintenance(maintenance.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete maintenance"
            onClick={() => onDeleteMaintenance(maintenance.id)}
            sx={{ ml: 1 }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
      sx={{ py: 2 }} // Add some padding for better spacing
    >
      <ListItemText
        primary={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              {maintenance.service}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              color={maintenance.done ? "success.main" : "warning.main"}
              sx={{ ml: 2, fontWeight: "medium" }}
            >
              {maintenance.done ? "Realizada" : "Pendente"}
            </Typography>
          </Box>
        }
        secondary={
          <>
            <Typography
              sx={{ display: "block", mt: 0.5 }} // Add a small top margin
              component="span"
              variant="body2"
              color="text.secondary"
            >
              Descrição: {maintenance.description || "N/A"}
            </Typography>
            <Typography
              sx={{ display: "block" }}
              component="span"
              variant="body2"
              color="text.secondary"
            >
              Prevista para:{" "}
              {new Date(maintenance.expected_at).toLocaleDateString()}
            </Typography>
            {maintenance.performed_at && (
              <Typography
                sx={{ display: "block" }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                Realizada em:{" "}
                {new Date(maintenance.performed_at).toLocaleDateString()}
              </Typography>
            )}
            {maintenance.condition_next_maintenance && (
              <Typography
                sx={{ display: "block" }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                Próxima Condição: {maintenance.condition_next_maintenance}
              </Typography>
            )}
            {maintenance.date_next_maintenance && (
              <Typography
                sx={{ display: "block" }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                Próxima Data:{" "}
                {new Date(
                  maintenance.date_next_maintenance
                ).toLocaleDateString()}
              </Typography>
            )}
          </>
        }
      />
    </ListItem>
  );
};

export default MaintenanceListItem;
