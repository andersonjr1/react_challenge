import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AssetDetailHeaderProps {
  title: string;
  onAddMaintenanceClick: () => void;
  addMaintenanceDisabled?: boolean;
}

const AssetDetailHeader: React.FC<AssetDetailHeaderProps> = ({
  title,
  onAddMaintenanceClick,
  addMaintenanceDisabled = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddMaintenanceClick}
        disabled={addMaintenanceDisabled}
      >
        Manutenção
      </Button>
    </Box>
  );
};

export default AssetDetailHeader;
