import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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

// Definindo a interface para a Manutenção, baseada no seu retorno de API
interface Maintenance {
  id: string;
  asset_id: string;
  service: string;
  expected_at: string; // ISO date string or YYYY-MM-DD
  performed_at: string | null; // ISO date string or YYYY-MM-DD, can be null
  description: string;
  done: boolean;
  created_at: string;
  updated_at: string;
  condition_next_maintenance?: string | null;
  date_next_maintenance?: string | null;
}

import { UserContext } from "../contexts/UserContext";

const API_BASE_URL = "http://localhost:3000/api"; // Substitua pelo seu IP/domínio real

const formatIsoToDateInput = (isoString: string | null): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
};

const formatDateInputToIso = (dateInput: string | null): string | null => {
  if (!dateInput) return null;
  // Assuming API expects YYYY-MM-DD as is or can parse it
  return dateInput; // For now, send as YYYY-MM-DD
  // If API needs full ISO: return new Date(dateInput).toISOString();
};

const EditarManutencaoPage: React.FC = () => {
  const { ativoId, manutencaoId } = useParams<{
    ativoId: string;
    manutencaoId: string;
  }>();

  const navigate = useNavigate();

  const userCtx = React.useContext(UserContext);

  useEffect(() => {
    if (!userCtx.isLoggedIn) {
      navigate("/login");
    }
  }, [userCtx.isLoggedIn]);

  const [service, setService] = useState<string>("");
  const [expectedAt, setExpectedAt] = useState<string>(""); // YYYY-MM-DD format for input
  const [performedAt, setPerformedAt] = useState<string>(""); // YYYY-MM-DD format for input
  const [description, setDescription] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);
  const [conditionNextMaintenance, setConditionNextMaintenance] =
    useState<string>("");
  const [dateNextMaintenance, setDateNextMaintenance] = useState<string>(""); // YYYY-MM-DD format for input

  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Função para buscar os dados da manutenção existente
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      if (!ativoId || !manutencaoId) {
        setError("ID do ativo ou da manutenção não fornecido na URL.");
        setInitialLoading(false);
        return;
      }

      try {
        // Assumindo que a API para buscar uma única manutenção é /api/manutencoes/:id
        // ou /api/ativos/:ativoId/manutencoes/:manutencaoId
        // Com base no seu exemplo de API, usaremos a segunda opção para consistência.
        const response = await fetch(
          `${API_BASE_URL}/ativos/${ativoId}/manutencoes`,
          { credentials: "include" }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Falha ao carregar os dados da manutenção."
          );
        }
        const data: Maintenance[] = await response.json();
        const maintenanceToEdit = data.find((m) => m.id === manutencaoId);

        if (!maintenanceToEdit) {
          throw new Error("Manutenção não encontrada.");
        }

        setService(maintenanceToEdit.service);
        setExpectedAt(formatIsoToDateInput(maintenanceToEdit.expected_at));
        setPerformedAt(formatIsoToDateInput(maintenanceToEdit.performed_at));
        setDescription(maintenanceToEdit.description || "");
        setDone(maintenanceToEdit.done);
        setConditionNextMaintenance(
          maintenanceToEdit.condition_next_maintenance || ""
        );
        setDateNextMaintenance(
          formatIsoToDateInput(maintenanceToEdit.date_next_maintenance || "")
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar manutenção."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [ativoId, manutencaoId]); // Recarrega se os IDs mudarem

  // Função para lidar com o envio do formulário de edição
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validação: pelo menos um campo (serviço ou descrição) deve ser preenchido
    // ou se as datas ou o status 'done' foram alterados.
    const isAnyFieldFilled =
      service.trim() ||
      description.trim() ||
      expectedAt ||
      performedAt ||
      conditionNextMaintenance.trim() ||
      dateNextMaintenance;
    if (!isAnyFieldFilled && !done) {
      // This validation might need adjustment based on how 'done' interacts
      // Assuming 'done' can also be the only change
      setError("Pelo menos um campo deve ser preenchido ou alterado.");
      setLoading(false);
      return;
    }

    try {
      // Sua API de exemplo para update de manutenção é {{ip}}/api/ativos/:id/manutencoes
      // Mas para uma manutenção específica, geralmente é /api/manutencoes/:id
      // Vamos assumir uma rota mais RESTful para PUT/PATCH em uma manutenção específica:
      // {{ip}}/api/manutencoes/:manutencaoId
      const response = await fetch(
        `${API_BASE_URL}/manutencoes/${manutencaoId}`,
        {
          method: "PUT", // Ou 'PATCH', dependendo da sua API
          headers: {
            "Content-Type": "application/json",
            // Inclua o token de autenticação se sua API exigir
            // 'Authorization': `Bearer ${seuTokenDeAutenticacao}`,
          },
          body: JSON.stringify({
            service: service.trim(),
            expected_at: formatDateInputToIso(expectedAt),
            performed_at: formatDateInputToIso(performedAt),
            description: description.trim(),
            done: done,
            condition_next_maintenance: conditionNextMaintenance.trim()
              ? conditionNextMaintenance.trim()
              : null,
            date_next_maintenance: formatDateInputToIso(dateNextMaintenance),
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Falha ao atualizar a manutenção."
        );
      }

      setSuccess("Manutenção atualizada com sucesso!");
      setTimeout(() => {
        navigate(`/ativos/${ativoId}/detalhes`); // Redireciona para o histórico do ativo
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

  // Função para lidar com o cancelamento
  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  if (initialLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Carregando dados da manutenção...
        </Typography>
      </Box>
    );
  }

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
          Editar Manutenção
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
          />
          <TextField
            margin="normal"
            fullWidth
            id="expected_at"
            label="Data Esperada"
            name="expected_at"
            type="date" // Define o tipo para um seletor de data
            InputLabelProps={{ shrink: true }} // Garante que o label não sobreponha a data
            value={expectedAt}
            onChange={(e) => setExpectedAt(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="performed_at"
            label="Data Realizada"
            name="performed_at"
            type="date" // Define o tipo para um seletor de data
            InputLabelProps={{ shrink: true }}
            value={performedAt}
            onChange={(e) => setPerformedAt(e.target.value)}
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
            sx={{ mt: 1, mb: 2 }}
          />
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {/* Restaurado o prop 'item' para o funcionamento correto do Grid */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Salvar"}
              </Button>
            </Grid>
            {/* Restaurado o prop 'item' para o funcionamento correto do Grid */}
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

export default EditarManutencaoPage;
