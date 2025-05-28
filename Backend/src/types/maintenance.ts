/**
 * Represents a maintenance record in the system.
 */
export interface MaintenanceRecord {
  id: string; // UUID
  asset_id: string; // UUID, foreign key to assets table
  service: string;
  expected_at: Date | string | null; // Stored as DATE in DB, can be string on input/output
  performed_at: Date | string | null; // Stored as DATE in DB, can be string on input/output
  description: string | null;
  done: boolean | null;
  condition_next_maintenance: string | null; // VARCHAR(255)
  date_next_maintenance: Date | string | null; // Stored as DATE in DB
  created_at: Date;
  updated_at: Date;
}

/**
 * Request body for creating a new maintenance record.
 * asset_id will be provided by the service layer from the route parameter.
 */
export interface CreateMaintenanceRecordClientBody {
  service: string;
  expected_at?: string | null; // Client typically sends dates as strings
  performed_at?: string | null;
  description?: string | null;
  done?: boolean | null;
  condition_next_maintenance?: string | null;
  date_next_maintenance?: string | null; // Client typically sends dates as strings
}

/**
 * Data transfer object for creating a maintenance record in the repository.
 */
export interface CreateMaintenanceRecordRepositoryData extends CreateMaintenanceRecordClientBody {
  asset_id: string;
}

/**
 * Request body for updating an existing maintenance record.
 * All fields are optional.
 */
export type UpdateMaintenanceRecordRequestBody = Partial<CreateMaintenanceRecordClientBody>;