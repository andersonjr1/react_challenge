import React from "react";
import { Box, TextField, Button, CircularProgress, Grid } from "@mui/material";

interface AssetFormProps {
  name: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  nameError?: string | null;
  descriptionError?: string | null;
}

const AssetForm: React.FC<AssetFormProps> = ({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  onSubmit,
  onCancel,
  isLoading,
  submitButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  nameError,
  descriptionError,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{ mt: 1, width: "100%" }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nome do Ativo"
        name="name"
        autoComplete="off"
        value={name}
        onChange={onNameChange}
        error={!!nameError}
        helperText={nameError}
      />
      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Descrição Detalhada (Modelo, Placa, Localização etc.)"
        name="description"
        autoComplete="off"
        multiline
        rows={4}
        value={description}
        onChange={onDescriptionChange}
        error={!!descriptionError}
        helperText={descriptionError}
      />

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : submitButtonText}
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ py: 1.5 }}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelButtonText}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetForm;
