import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventNoteIcon from "@mui/icons-material/EventNote";
import UpdateIcon from "@mui/icons-material/Update";
import type { Maintenance } from "../types/types";
import { formatDate, getMaintenanceStatus } from "../utils/utils";

interface DashboardMaintenanceItemProps {
  maintenance: Maintenance;
  assetId: string;
  onEditClick: (assetId: string, maintenanceId: string) => void;
  onMarkAsDoneClick: (maintenanceId: string) => void;
}

const DashboardMaintenanceItem: React.FC<DashboardMaintenanceItemProps> = ({
  maintenance,
  assetId,
  onEditClick,
  onMarkAsDoneClick,
}) => {
  const status = getMaintenanceStatus(
    maintenance.expected_at,
    maintenance.done
  );
  let StatusIcon = EventNoteIcon;
  if (status.label === "Atrasada") StatusIcon = EventBusyIcon;
  else if (status.label.startsWith("Próxima")) StatusIcon = UpdateIcon;

  return (
    <ListItem
      secondaryAction={
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0.5,
            // height: 100, // Removed fixed height to allow content to define it
          }}
        >
          <Tooltip title="Editar Manutenção">
            <IconButton
              size="small"
              edge="end"
              aria-label="edit maintenance"
              onClick={() => onEditClick(assetId, maintenance.id)}
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
                onClick={() => onMarkAsDoneClick(maintenance.id)}
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
        alignItems: "flex-start", // Align items to the start for better layout with multi-line text
      }}
    >
      <ListItemIcon sx={{ minWidth: "36px", mt: 1 }}>
        {" "}
        {/* Added margin top for better alignment */}
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
              Previsto: {formatDate(maintenance.expected_at)}
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
};

export default DashboardMaintenanceItem;
