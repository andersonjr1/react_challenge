import { pool } from "../database/db";
// The authRepository.ts imports ErrorStatus but doesn't use it in the provided snippet.
// For consistency with that pattern, it's imported here.
// If ErrorStatus is intended for custom error objects with status codes,
// it would be used when throwing specific, handled errors.
import { ErrorStatus } from "../utils/error";
import { Asset, CreateAssetRequestBody, UpdateAssetRequestBody } from "../types/assets";

/**
 * Represents an asset in the system.
 */

const assetsRepository = {
  /**
   * Creates a new asset in the database.
   * @param data - The data for the new asset.
   * @returns The newly created asset.
   */
  create: async (data: CreateAssetRequestBody): Promise<Asset> => {
    try {
      const query = `
        INSERT INTO assets (user_id, name, description)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      // Ensure description is null if undefined, matching database schema
      const values = [data.user_id, data.name, data.description ?? null];
      const response = await pool.query(query, values);
      return response.rows[0] as Asset;
    } catch (error) {
      throw error; // Re-throw to be handled by the service layer or error middleware
    }
  },

  /**
   * Retrieves an asset by its ID.
   * @param id - The ID of the asset to retrieve.
   * @returns The asset if found, otherwise null.
   */
  getById: async (id: string): Promise<Asset | null> => {
    try {
      const query = "SELECT * FROM assets WHERE id = $1";
      const response = await pool.query(query, [id]);
      if (response.rowCount === 0) {
        return null;
      }
      return response.rows[0] as Asset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves all assets belonging to a specific user.
   * @param userId - The ID of the user.
   * @returns A list of assets for the user, ordered by creation date descending.
   */
  getByUserId: async (userId: string): Promise<Asset[]> => {
    try {
      const query = "SELECT * FROM assets WHERE user_id = $1 ORDER BY created_at DESC";
      const response = await pool.query(query, [userId]);
      return response.rows as Asset[];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates an existing asset.
   * Only updates fields that are provided in the `data` object.
   * The `updated_at` field is always updated if any changes are made.
   * @param id - The ID of the asset to update.
   * @param data - An object containing the fields to update.
   * @returns The updated asset if found and updated, otherwise null.
   */
  update: async (id: string, data: UpdateAssetRequestBody): Promise<Asset | null> => {
    try {
      const fieldsToUpdate: string[] = [];
      const values: any[] = [];
      let queryIndex = 1;

      if (data.name !== undefined) {
        fieldsToUpdate.push(`name = $${queryIndex++}`);
        values.push(data.name);
      }
      if (data.hasOwnProperty('description')) {
        fieldsToUpdate.push(`description = $${queryIndex++}`);
        values.push(data.description);
      }

      fieldsToUpdate.push(`updated_at = CURRENT_TIMESTAMP`);
      const setClause = fieldsToUpdate.join(", ");
      values.push(id); // For the WHERE id = $N clause

      const query = `UPDATE assets SET ${setClause} WHERE id = $${queryIndex} RETURNING *;`;
      const response = await pool.query(query, values);
      if(response.rowCount){
        return response.rowCount > 0 ? (response.rows[0] as Asset) : null;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deletes an asset by its ID.
   * @param id - The ID of the asset to delete.
   * @returns True if the asset was deleted, false otherwise.
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const query = "DELETE FROM assets WHERE id = $1";
      const response = await pool.query(query, [id]);
      if(response.rowCount){
        return response.rowCount > 0;
      }
      return false;
    } catch (error) {
      throw error;
    }
  },
};

export { assetsRepository };