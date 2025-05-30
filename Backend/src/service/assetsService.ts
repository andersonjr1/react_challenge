import { ErrorStatus } from "../utils/error";
import { assetsRepository as repository } from "../repository/assetsRepository";
import { validateAssetName, validateAssetDescription } from "../utils/assetValidators";
import { Asset, CreateAssetRequestBody, UpdateAssetRequestBody } from "../types/assets";

const assetsService = {
  /**
   * Creates a new asset after validating the input data.
   * @param data - The data for the new asset, including user_id, name, and optional description.
   * @returns The newly created asset.
   * @throws {ErrorStatus} if validation fails or a required field is missing.
   */
  createAsset: async (data: CreateAssetRequestBody): Promise<Asset> => {
    try {
      let { user_id, name, description } = data;

      if (!user_id) {
        const error = new ErrorStatus("ID do usuário é obrigatório");
        error.status = 400;
        throw error;
      }
      if (!name) {
        const error = new ErrorStatus("Nome do ativo é obrigatório");
        error.status = 400;
        throw error;
      }

      name = name.trim();
      if (description !== undefined && description !== null) {
        description = description.trim();
      }

      if (!validateAssetName(name)) {
        const error = new ErrorStatus("Nome do ativo inválido. Deve ser uma string não vazia com no máximo 255 caracteres.");
        error.status = 400;
        throw error;
      }

      if (description !== undefined && description !== null && !validateAssetDescription(description)) {
        const error = new ErrorStatus("Descrição do ativo inválida. Se fornecida, deve ser uma string.");
        error.status = 400;
        throw error;
      }

      const assetDataToCreate: CreateAssetRequestBody = {
        user_id,
        name,
        description: description ?? undefined, // Repository handles undefined by setting DB field to NULL
      };

      const newAsset = await repository.create(assetDataToCreate);
      return newAsset;
    } catch (error) {
      throw error; // Re-throw to be handled by the controller or error middleware
    }
  },

  /**
   * Retrieves an asset by its ID.
   * @param id - The ID of the asset.
   * @returns The asset.
   * @throws {ErrorStatus} if the asset is not found or ID is invalid.
   */
  getAssetById: async (id: string): Promise<Asset> => {
    try {
      // Optional: Add UUID validation for id here if not handled elsewhere
      const asset = await repository.getById(id);
      if (!asset) {
        const error = new ErrorStatus("Ativo não encontrado");
        error.status = 404;
        throw error;
      }
      return asset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves all assets for a given user ID.
   * @param userId - The ID of the user.
   * @returns A list of assets.
   */
  getAssetsByUserId: async (userId: string): Promise<Asset[]> => {
    try {
      // Optional: Add UUID validation for userId here
      const assets = await repository.getByUserId(userId);
      return assets;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates an existing asset.
   * @param id - The ID of the asset to update.
   * @param data - The data to update (name and/or description).
   * @returns The updated asset.
   * @throws {ErrorStatus} if validation fails, asset not found, or no update performed.
   */
  updateAsset: async (id: string, data: UpdateAssetRequestBody): Promise<Asset> => {
    try {
      let { name, description } = data;
      const updateData: UpdateAssetRequestBody = {};
      let hasUpdates = false;

      if (name !== undefined) {
        name = name.trim();
        if (!validateAssetName(name)) {
          const error = new ErrorStatus("Nome do ativo inválido. Deve ser uma string não vazia com no máximo 255 caracteres.");
          error.status = 400;
          throw error;
        }
        updateData.name = name;
        hasUpdates = true;
      }

      if (data.hasOwnProperty('description')) { // Check if description key is present, even if value is null or undefined
        if (description !== null && description !== undefined) {
          description = description.trim();
        }
        if (!validateAssetDescription(description)) { // Validator handles null/undefined correctly
          const error = new ErrorStatus("Descrição do ativo inválida. Se fornecida, deve ser uma string.");
          error.status = 400;
          throw error;
        }
        updateData.description = description;
        hasUpdates = true;
      }

      // The repository's update method updates `updated_at` even if no other fields change.
      // If !hasUpdates, we are essentially just "touching" the record to update `updated_at`.

      const updatedAsset = await repository.update(id, updateData);
      if (!updatedAsset) {
        const error = new ErrorStatus("Ativo não encontrado ou nenhuma atualização necessária/realizada");
        error.status = 404;
        throw error;
      }
      return updatedAsset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deletes an asset by its ID.
   * @param id - The ID of the asset to delete.
   * @throws {ErrorStatus} if the asset is not found or cannot be deleted.
   */
  deleteAsset: async (id: string): Promise<void> => {
    try {
      const success = await repository.delete(id);
      if (!success) {
        const error = new ErrorStatus("Ativo não encontrado ou não pôde ser excluído");
        error.status = 404;
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
};

export { assetsService };