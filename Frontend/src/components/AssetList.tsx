import React from "react";
import { List, Typography, Divider } from "@mui/material";
import type { Asset } from "../types/types";
import AssetListItem from "./AssetListItem";

interface AssetListProps {
  assets: Asset[];
  onViewDetails: (assetId: string) => void;
  onEditAsset: (assetId: string) => void;
  onDeleteAsset: (assetId: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  onViewDetails,
  onEditAsset,
  onDeleteAsset,
}) => {
  if (assets.length === 0) {
    return (
      <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 4 }}>
        Nenhum ativo encontrado. Comece adicionando um novo!
      </Typography>
    );
  }

  return (
    <List sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
      {assets.map((asset, index) => (
        <React.Fragment key={asset.id}>
          <AssetListItem
            asset={asset}
            onViewDetails={onViewDetails}
            onEditAsset={onEditAsset}
            onDeleteAsset={onDeleteAsset}
          />
          {index < assets.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default AssetList;
