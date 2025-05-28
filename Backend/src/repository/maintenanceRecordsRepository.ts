import { pool } from "../database/db";
import { MaintenanceRecord, CreateMaintenanceRecordRepositoryData, UpdateMaintenanceRecordRequestBody } from "../types/maintenance";

const maintenanceRecordsRepository = {
  /**
   * Creates a new maintenance record in the database.
   * @param data - The data for the new maintenance record.
   * @returns The newly created maintenance record.
   */
  create: async (data: CreateMaintenanceRecordRepositoryData): Promise<MaintenanceRecord | null> => {
    try {
      const query = `
        INSERT INTO maintenance_records (asset_id, service, expected_at, performed_at, description, done, condition_next_maintenance, date_next_maintenance)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      const values = [
        data.asset_id,
        data.service,
        data.expected_at ?? null,
        data.performed_at ?? null,
        data.description ?? null,
        data.done ?? null, // Default to false in DB or handle here if needed
        data.condition_next_maintenance ?? null,
        data.date_next_maintenance ?? null,
      ];
      const response = await pool.query(query, values);
      if(response.rowCount)
        return response.rows[0] as MaintenanceRecord;
      return null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves a maintenance record by its ID.
   * @param id - The ID of the maintenance record.
   * @returns The maintenance record if found, otherwise null.
   */
  getById: async (id: string): Promise<MaintenanceRecord | null> => {
    try {
      const query = "SELECT * FROM maintenance_records WHERE id = $1";
      const response = await pool.query(query, [id]);
      if(response.rowCount)
        return response.rowCount > 0 ? (response.rows[0] as MaintenanceRecord) : null;
      return null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves all maintenance records for a specific asset.
   * @param assetId - The ID of the asset.
   * @returns A list of maintenance records for the asset, ordered by creation date descending.
   */
  getByAssetId: async (assetId: string): Promise<MaintenanceRecord[]> => {
    try {
      const query = "SELECT * FROM maintenance_records WHERE asset_id = $1 ORDER BY created_at DESC";
      const response = await pool.query(query, [assetId]);
      return response.rows as MaintenanceRecord[];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates an existing maintenance record.
   * @param id - The ID of the maintenance record to update.
   * @param data - An object containing the fields to update.
   * @returns The updated maintenance record if found and updated, otherwise null.
   */
  update: async (id: string, data: UpdateMaintenanceRecordRequestBody): Promise<MaintenanceRecord | null> => {
    try {
      const fieldsToUpdate: string[] = [];
      const values: any[] = [];
      let queryIndex = 1;

      if (data.service !== undefined) {
        fieldsToUpdate.push(`service = $${queryIndex++}`);
        values.push(data.service);
      }
      if (data.hasOwnProperty('expected_at')) {
        fieldsToUpdate.push(`expected_at = $${queryIndex++}`);
        values.push(data.expected_at);
      }
      if (data.hasOwnProperty('performed_at')) {
        fieldsToUpdate.push(`performed_at = $${queryIndex++}`);
        values.push(data.performed_at);
      }
      if (data.hasOwnProperty('description')) {
        fieldsToUpdate.push(`description = $${queryIndex++}`);
        values.push(data.description);
      }
      if (data.hasOwnProperty('done')) {
        fieldsToUpdate.push(`done = $${queryIndex++}`);
        values.push(data.done);
      }
      if (data.hasOwnProperty('condition_next_maintenance')) {
        fieldsToUpdate.push(`condition_next_maintenance = $${queryIndex++}`);
        values.push(data.condition_next_maintenance);
      }
      if (data.hasOwnProperty('date_next_maintenance')) {
        fieldsToUpdate.push(`date_next_maintenance = $${queryIndex++}`);
        values.push(data.date_next_maintenance);
      }

      if (fieldsToUpdate.length === 0) {
        // To ensure `updated_at` is modified, or return current if no actual data change
        const currentRecord = await maintenanceRecordsRepository.getById(id);
        return currentRecord; // Or throw error if update must change data
      }

      fieldsToUpdate.push(`updated_at = CURRENT_TIMESTAMP`);
      const setClause = fieldsToUpdate.join(", ");
      values.push(id); // For the WHERE id = $N clause

      const query = `UPDATE maintenance_records SET ${setClause} WHERE id = $${queryIndex} RETURNING *;`;
      const response = await pool.query(query, values);
      if(response.rowCount)
        return response.rowCount > 0 ? (response.rows[0] as MaintenanceRecord) : null;
      return null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deletes a maintenance record by its ID.
   * @param id - The ID of the maintenance record to delete.
   * @returns True if the record was deleted, false otherwise.
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const query = "DELETE FROM maintenance_records WHERE id = $1";
      const response = await pool.query(query, [id]);
      if(response.rowCount)
        return response.rowCount > 0;
      return false;
    } catch (error) {
      throw error;
    }
  },
};

export { maintenanceRecordsRepository };