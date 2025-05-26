// src/types.ts
export interface Asset {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Maintenance {
  id: string;
  asset_id: string;
  service: string;
  expected_at: string;
  performed_at: string | null; // Can be null if not performed
  description: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssetWithMaintenances extends Asset {
  maintenances: Maintenance[];
  // Helper property for sorting/filtering
  mostRelevantMaintenanceDate?: string; // Earliest expected_at for undone maintenances
  hasUrgentOrUpcomingMaintenance?: boolean;
}

export type SortOption = "urgency" | "name_asc" | "name_desc";