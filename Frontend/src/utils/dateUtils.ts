// src/utils/dateUtils.ts

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getMaintenanceStatus = (
  expectedAtString: string,
  done: boolean
): { label: string; color: string; isUrgent: boolean } => {
  if (done) {
    return { label: 'Concluída', color: 'success.main', isUrgent: false };
  }

  const expectedDate = new Date(expectedAtString);
  const now = new Date();

  if (isNaN(expectedDate.getTime())) {
    return { label: 'Data Inválida', color: 'text.disabled', isUrgent: false };
  }

  if (expectedDate.getTime() < now.getTime()) {
    return { label: 'Atrasada', color: 'error.main', isUrgent: true };
  }

  const expectedDateOnly = new Date(expectedDate);
  expectedDateOnly.setHours(0, 0, 0, 0);

  const todayOnly = new Date(now);
  todayOnly.setHours(0, 0, 0, 0);

  const diffTime = expectedDateOnly.getTime() - todayOnly.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return { label: `Próxima (${diffDays}d)`, color: 'warning.main', isUrgent: true };
  }

  return { label: 'Agendada', color: 'info.main', isUrgent: false };
};

export const formatIsoToDateInput = (isoString: string | null | undefined): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return ""; // Invalid date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Returns YYYY-MM-DD
  } catch (e) {
    console.error("Error formatting ISO string to date input:", e);
    return "";
  }
};

export const formatDateInputToIso = (dateInput: string | null | undefined): string | null => {
  if (!dateInput) return null;
  // Assuming API expects YYYY-MM-DD as is or can parse it.
  // If API needs full ISO string: return new Date(dateInput).toISOString();
  return dateInput; // Returns YYYY-MM-DD
};