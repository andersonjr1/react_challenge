import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import type { Asset } from "../types/types";

interface AssetListItemProps {
  asset: Asset;
  onViewDetails: (assetId: string) => void;
  onEditAsset: (assetId: string) => void;
  onDeleteAsset: (assetId: string) => void;
}

const AssetListItem: React.FC<AssetListItemProps> = ({
  asset,
  onViewDetails,
  onEditAsset,
  onDeleteAsset,
}) => {
  return (
    <ListItem>
      <ListItemText
        primary={asset.name}
        secondary={asset.description || "Sem descrição"}
      />
      <ListItemSecondaryAction>
        <Tooltip title="Ver Detalhes/Histórico">
          <IconButton
            edge="end"
            aria-label="details"
            onClick={() => onViewDetails(asset.id)}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar Ativo">
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{ ml: 1 }}
            onClick={() => onEditAsset(asset.id)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remover Ativo">
          <IconButton
            edge="end"
            aria-label="delete"
            sx={{ ml: 1 }}
            onClick={() => onDeleteAsset(asset.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default AssetListItem;
