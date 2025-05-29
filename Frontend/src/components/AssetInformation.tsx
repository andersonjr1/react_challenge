import React from "react";
import { Box, Typography, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface AssetInformationProps {
  assetName: string;
  assetDescription: string;
  onEditAssetClick: () => void;
  editAssetDisabled?: boolean;
}

const AssetInformation: React.FC<AssetInformationProps> = ({
  assetName,
  assetDescription,
  onEditAssetClick,
  editAssetDisabled = false,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom color="primary">
          Ativo: {assetName}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onEditAssetClick}
          disabled={editAssetDisabled}
        >
          Editar Ativo
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {assetDescription}
      </Typography>
    </>
  );
};

export default AssetInformation;
