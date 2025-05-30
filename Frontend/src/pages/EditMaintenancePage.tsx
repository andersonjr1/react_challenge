import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import { UserContext } from "../contexts/UserContext";
import type { Maintenance } from "../types/types"; // Import the Maintenance interface
import { formatIsoToDateInput, formatDateInputToIso } from "../utils/utils"; // Import date utility functions
import MaintenanceForm from "../components/MaintenanceForm"; // Import the new MaintenanceForm component

const API_BASE_URL = "http://localhost:3000/api"; // Substitua pelo seu IP/domínio real

const EditMaintenancePage: React.FC = () => {
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
  }, [userCtx.isLoggedIn, navigate]);

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
    // Ensure performed_at is cleared if done is false,
    // and done is true if performed_at has a value.
    const finalPerformedAt = performedAt;
    let finalDone = done;

    if (performedAt && !done) {
      finalDone = true;
    } else if (!performedAt && done && !initialLoading) {
      // Only clear performedAt if user unchecks 'done' after initial load
      // This scenario should ideally be handled by onDoneChange,
      // but as a safeguard for submission:
      // If 'done' is true but 'performedAt' is empty, it's an inconsistency.
      // For editing, we might allow 'done' to be true without a date if it was like that initially.
      // However, the new onDoneChange handler will clear performedAt if done is unchecked.
    }

    try {
      // API endpoint for updating a specific maintenance
      const response = await fetch(
        `${API_BASE_URL}/manutencoes/${manutencaoId}`,
        {
          method: "PUT", // Ou 'PATCH', dependendo da sua API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service: service.trim(),
            expected_at: formatDateInputToIso(expectedAt),
            performed_at: finalPerformedAt.trim()
              ? formatDateInputToIso(finalPerformedAt)
              : null,
            description: description.trim(),
            done: finalDone,
            condition_next_maintenance: conditionNextMaintenance.trim()
              ? conditionNextMaintenance.trim()
              : null,
            // Send date_next_maintenance only if it has a value
            ...(dateNextMaintenance && {
              date_next_maintenance: formatDateInputToIso(dateNextMaintenance),
            }),
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

  // Função para lidar com o cancelamento
  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handlePerformedAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPerformedAt = e.target.value;
    setPerformedAt(newPerformedAt);
    if (newPerformedAt) {
      setDone(true); // Automatically check "done" if a date is entered
    }
  };

  const handleDoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDone = e.target.checked;
    setDone(newDone);
    if (!newDone) {
      setPerformedAt(""); // Clear performedAt if "done" is unchecked
    }
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

        <MaintenanceForm
          service={service}
          onServiceChange={(e) => setService(e.target.value)}
          expectedAt={expectedAt}
          onExpectedAtChange={(e) => setExpectedAt(e.target.value)}
          performedAt={performedAt} // Pass the state
          onPerformedAtChange={handlePerformedAtChange} // Use the new handler
          description={description}
          onDescriptionChange={(e) => setDescription(e.target.value)}
          done={done} // Pass the state
          onDoneChange={handleDoneChange} // Use the new handler
          conditionNextMaintenance={conditionNextMaintenance}
          onConditionNextMaintenanceChange={(e) =>
            setConditionNextMaintenance(e.target.value)
          }
          dateNextMaintenance={dateNextMaintenance}
          onDateNextMaintenanceChange={(e) =>
            setDateNextMaintenance(e.target.value)
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          submitButtonText="Salvar Alterações"
        />
      </Box>
    </Container>
  );
};

export default EditMaintenancePage;
