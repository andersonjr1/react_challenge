// src/services/apiService.ts
import type { Asset, Maintenance, AssetWithMaintenances} from '../types/types';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual IP/domain

// Basic error handling for fetch
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido na API' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchAssets(): Promise<Asset[]> {
  const response = await fetch(`${API_BASE_URL}/ativos`, {credentials: "include"});
  return handleResponse<Asset[]>(response);
}

export async function fetchMaintenancesForAsset(assetId: string): Promise<Maintenance[]> {
  const response = await fetch(`${API_BASE_URL}/ativos/${assetId}/manutencoes`, {credentials: "include"});
  return handleResponse<Maintenance[]>(response);
}

// Function to fetch assets and their maintenances, then combine them
export async function fetchAssetsWithMaintenances(): Promise<AssetWithMaintenances[]> {
  const assets = await fetchAssets();
  const assetsWithMaintenances: AssetWithMaintenances[] = await Promise.all(
    assets.map(async (asset) => {
      const maintenances = await fetchMaintenancesForAsset(asset.id);
      console.log(maintenances)
      const undoneMaintenances = maintenances.filter(m => !m.done);

      let mostRelevantDate: string | undefined = undefined;
      if (undoneMaintenances.length > 0) {
        // Sort by expected_at to find the earliest
        undoneMaintenances.sort((a, b) => new Date(a.expected_at).getTime() - new Date(b.expected_at).getTime());
        mostRelevantDate = undoneMaintenances[0].expected_at;
      }

      return {
        ...asset,
        maintenances: maintenances, // Store all maintenances for history view
        mostRelevantMaintenanceDate: mostRelevantDate,
        hasUrgentOrUpcomingMaintenance: undoneMaintenances.length > 0, // Asset has any undone maintenance
      };
    })
  );
  // Filter out assets that don't have any upcoming/overdue maintenance
  return assetsWithMaintenances.filter(a => a.hasUrgentOrUpcomingMaintenance);
}

// Placeholder for future API calls
export async function updateMaintenance(maintenanceId: string, data: Partial<Maintenance>): Promise<Maintenance> {
  const response = await fetch(`${API_BASE_URL}/manutencoes/${maintenanceId}`, { // Assuming endpoint
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: "include"
  });
  return handleResponse<Maintenance>(response);
}