import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router"; // Use react-router-dom
import { Container, Box, Typography, Alert } from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import type { NewMaintenanceData } from "../types/types"; // Import the interface
import MaintenanceForm from "../components/MaintenanceForm"; // Import the reusable MaintenanceForm
import { formatDateInputToIso } from "../utils/dateUtils"; // Import the utility function

const API_BASE_URL = "http://localhost:3000/api"; // Substitua pelo seu IP/domínio real

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
      expected_at: formatDateInputToIso(expectedAt),
      // performed_at só é enviado se preenchido
      ...(performedAt && {
        performed_at: formatDateInputToIso(performedAt),
      }),
      description: description.trim(),
      done: done,
      ...(conditionNextMaintenance.trim() && {
        condition_next_maintenance: conditionNextMaintenance.trim(),
      }),
      ...(dateNextMaintenance && {
        date_next_maintenance: formatDateInputToIso(dateNextMaintenance),
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

        <MaintenanceForm
          service={service}
          onServiceChange={(e) => setService(e.target.value)}
          expectedAt={expectedAt}
          onExpectedAtChange={(e) => setExpectedAt(e.target.value)}
          performedAt={performedAt}
          onPerformedAtChange={(e) => setPerformedAt(e.target.value)}
          description={description}
          onDescriptionChange={(e) => setDescription(e.target.value)}
          done={done}
          onDoneChange={(e) => setDone(e.target.checked)}
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
          submitButtonText="Criar Manutenção"
        />
      </Box>
    </Container>
  );
};

export default CriarManutencaoPage;
