import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router"; // Use react-router-dom
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";

// Não precisamos da interface Maintenance completa aqui, apenas os campos que vamos enviar
interface NewMaintenanceData {
  asset_id: string;
  service: string;
  expected_at: string | null; // YYYY-MM-DD ou ISO
  performed_at?: string | null; // Opcional na criação, YYYY-MM-DD ou ISO
  description: string;
  done: boolean;
  condition_next_maintenance?: string | null;
  date_next_maintenance?: string | null; // YYYY-MM-DD ou ISO
}

const API_BASE_URL = "http://localhost:3000/api"; // Substitua pelo seu IP/domínio real

// Função auxiliar para formatar YYYY-MM-DD para ISO string (para API, se necessário)
// Se a API aceitar YYYY-MM-DD diretamente, esta função pode apenas retornar o valor.
const formatDateInputToApiFormat = (
  dateInput: string | null
): string | null => {
  if (!dateInput) return null;
  // Exemplo: se a API espera YYYY-MM-DD, retorna como está.
  // Se a API espera ISO string completa: return new Date(dateInput).toISOString();
  return dateInput;
};

const CriarManutencaoPage: React.FC = () => {
  const { ativoId } = useParams<{ ativoId: string }>(); // Apenas ativoId é necessário
  const navigate = useNavigate();

  const userCtx = React.useContext(UserContext);

  useEffect(() => {
    if (!userCtx.isLoggedIn) {
      navigate("/login");
    }
  }, [userCtx.isLoggedIn]);

  const [service, setService] = useState<string>("");
  const [expectedAt, setExpectedAt] = useState<string>(""); // Formato YYYY-MM-DD para input
  const [performedAt, setPerformedAt] = useState<string>(""); // Formato YYYY-MM-DD para input
  const [description, setDescription] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);
  const [conditionNextMaintenance, setConditionNextMaintenance] =
    useState<string>("");
  const [dateNextMaintenance, setDateNextMaintenance] = useState<string>(""); // Formato YYYY-MM-DD para input

  const [loading, setLoading] = useState<boolean>(false); // Para o estado de salvar
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Não há useEffect para buscar dados, pois é uma página de criação

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!ativoId) {
      setError("ID do ativo não encontrado na URL.");
      setLoading(false);
      return;
    }

    // Validação básica: serviço e data esperada são obrigatórios
    if (!service.trim() || !expectedAt) {
      setError("O serviço e a data esperada são obrigatórios.");
      setLoading(false);
      return;
    }

    const newMaintenanceData: NewMaintenanceData = {
      asset_id: ativoId,
      service: service.trim(),
      expected_at: formatDateInputToApiFormat(expectedAt),
      // performed_at só é enviado se preenchido
      ...(performedAt && {
        performed_at: formatDateInputToApiFormat(performedAt),
      }),
      description: description.trim(),
      done: done,
      ...(conditionNextMaintenance.trim() && {
        condition_next_maintenance: conditionNextMaintenance.trim(),
      }),
      ...(dateNextMaintenance && {
        date_next_maintenance: formatDateInputToApiFormat(dateNextMaintenance),
      }),
    };

    try {
      // Endpoint para criar manutenção: POST /api/ativos/:ativoId/manutencoes
      const response = await fetch(
        `${API_BASE_URL}/ativos/${ativoId}/manutencoes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMaintenanceData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao criar a manutenção.");
      }

      setSuccess("Manutenção criada com sucesso!");
      setTimeout(() => {
        navigate(-1); // Redireciona para o histórico do ativo
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro desconhecido ao salvar."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Criar Nova Manutenção
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
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
            onChange={(e) => setService(e.target.value)}
            error={!service.trim() && !!error}
            helperText={
              !service.trim() && !!error ? "Serviço é obrigatório." : ""
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="expected_at"
            label="Data Esperada"
            name="expected_at"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={expectedAt}
            onChange={(e) => setExpectedAt(e.target.value)}
            error={!expectedAt && !!error}
            helperText={
              !expectedAt && !!error ? "Data esperada é obrigatória." : ""
            }
          />
          <TextField
            margin="normal"
            fullWidth
            id="performed_at"
            label="Data Realizada (Opcional)"
            name="performed_at"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={performedAt}
            onChange={(e) => setPerformedAt(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Descrição (Opcional)"
            name="description"
            autoComplete="off"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            onChange={(e) => setConditionNextMaintenance(e.target.value)}
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
            onChange={(e) => setDateNextMaintenance(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={done}
                onChange={(e) => setDone(e.target.checked)}
                name="done"
                color="primary"
              />
            }
            label="Concluída"
            sx={{ mt: 1, mb: 2, display: "block" }} // display block para ocupar a largura
          />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {" "}
            {/* Ajustado mt para 2 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Criar Manutenção"}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ py: 1.5 }}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CriarManutencaoPage;
