import React from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface MaintenanceFormProps {
  service: string;
  onServiceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  expectedAt: string;
  onExpectedAtChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  performedAt: string;
  onPerformedAtChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  done: boolean;
  onDoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  conditionNextMaintenance: string;
  onConditionNextMaintenanceChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  dateNextMaintenance: string;
  onDateNextMaintenanceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  service,
  onServiceChange,
  expectedAt,
  onExpectedAtChange,
  performedAt,
  onPerformedAtChange,
  description,
  onDescriptionChange,
  done,
  onDoneChange,
  conditionNextMaintenance,
  onConditionNextMaintenanceChange,
  dateNextMaintenance,
  onDateNextMaintenanceChange,
  onSubmit,
  onCancel,
  isLoading,
  submitButtonText = "Salvar",
  cancelButtonText = "Cancelar",
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
        id="service"
        label="Serviço"
        name="service"
        autoComplete="off"
        value={service}
        onChange={onServiceChange}
      />
      <TextField
        margin="normal"
        fullWidth
        required // Making expected_at required as per previous validation
        id="expected_at"
        label="Data Esperada"
        name="expected_at"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={expectedAt}
        onChange={onExpectedAtChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="performed_at"
        label="Data Realizada"
        name="performed_at"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={performedAt}
        onChange={onPerformedAtChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Descrição"
        name="description"
        autoComplete="off"
        multiline
        rows={4}
        value={description}
        onChange={onDescriptionChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="condition_next_maintenance"
        label="Condição Próxima Manutenção (Opcional)"
        name="condition_next_maintenance"
        autoComplete="off"
        multiline
        rows={2}
        value={conditionNextMaintenance}
        onChange={onConditionNextMaintenanceChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="date_next_maintenance"
        label="Data Próxima Manutenção (Opcional)"
        name="date_next_maintenance"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={dateNextMaintenance}
        onChange={onDateNextMaintenanceChange}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={done}
            onChange={onDoneChange}
            name="done"
            color="primary"
          />
        }
        label="Concluída"
        sx={{ mt: 1, mb: 2, display: "block" }}
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
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

export default MaintenanceForm;
