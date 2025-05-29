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
  condition_next_maintenance?: string | null;
  date_next_maintenance?: string | null; // Assuming it comes as a string (e.g., ISO date)
  created_at: string;
  updated_at: string;
}

export interface AssetWithMaintenances extends Asset {
  maintenances: Maintenance[];
  // Helper property for sorting/filtering
  mostRelevantMaintenanceDate?: string; // Earliest expected_at for undone maintenances
  hasUrgentOrUpcomingMaintenance?: boolean;
}

export interface NewAssetData {
  name: string;
  description: string;
}

export interface NewMaintenanceData {
  asset_id: string;
  service: string;
  expected_at: string | null; // YYYY-MM-DD ou ISO
  performed_at?: string | null; // Opcional na criação, YYYY-MM-DD ou ISO
  description: string;
  done: boolean;
  condition_next_maintenance?: string | null;
  date_next_maintenance?: string | null; // YYYY-MM-DD ou ISO
}

export type SortOption = "urgency" | "name_asc" | "name_desc";

export interface UserData {
  id: string | null; // Assuming ID can be a string or null when not logged in
  name: string;
  email: string;
}

// Define the shape of the context value
export interface UserContextType extends UserData {
  isLoggedIn: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
}