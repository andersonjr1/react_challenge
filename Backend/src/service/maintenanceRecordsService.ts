import { ErrorStatus } from "../utils/error";
import { maintenanceRecordsRepository as repository } from "../repository/maintenanceRecordsRepository";
import { assetsRepository } from "../repository/assetsRepository"; // To check asset ownership
import {
  validateMaintenanceService,
  validateMaintenanceDate,
  validateMaintenanceDescription,
} from "../utils/maintenanceRecordsValidators";
import {
  MaintenanceRecord,
  CreateMaintenanceRecordClientBody,
  UpdateMaintenanceRecordRequestBody,
  CreateMaintenanceRecordRepositoryData,
} from "../types/maintenance";

const maintenanceRecordsService = {
  /**
   * Verifies if an asset belongs to a user.
   * @param assetId The ID of the asset.
   * @param userId The ID of the user.
   * @throws {ErrorStatus} if asset not found or user does not own the asset.
   */
  _verifyAssetOwnership: async (assetId: string, userId: string): Promise<void> => {
    const asset = await assetsRepository.getById(assetId);
    if (!asset) {
      const error = new ErrorStatus("Ativo associado não encontrado.");
      error.status = 404;
      throw error;
    }
    if (asset.user_id !== userId) {
      const error = new ErrorStatus("Você não tem permissão para gerenciar manutenções para este ativo.");
      error.status = 403;
      throw error;
    }
  },

  createMaintenanceRecord: async (
    assetId: string,
    userId: string,
    clientData: CreateMaintenanceRecordClientBody
  ): Promise<MaintenanceRecord | null> => {
    try {
      await maintenanceRecordsService._verifyAssetOwnership(assetId, userId);

      let { service, expected_at, performed_at, description, done } = clientData;

      if (!service) {
        const error = new ErrorStatus("Nome do serviço de manutenção é obrigatório.");
        error.status = 400;
        throw error;
      }
      service = service.trim();
      if (!validateMaintenanceService(service)) {
        const error = new ErrorStatus("Nome do serviço inválido. Deve ser uma string não vazia com no máximo 255 caracteres.");
        error.status = 400;
        throw error;
      }

      if (expected_at && !validateMaintenanceDate(expected_at)) {
        const error = new ErrorStatus("Data esperada inválida.");
        error.status = 400;
        throw error;
      }
      if (performed_at && !validateMaintenanceDate(performed_at)) {
        const error = new ErrorStatus("Data de realização inválida.");
        error.status = 400;
        throw error;
      }
      if (description !== undefined && description !== null && !validateMaintenanceDescription(description)) {
        const error = new ErrorStatus("Descrição inválida. Se fornecida, deve ser uma string.");
        error.status = 400;
        throw error;
      }

      const repoData: CreateMaintenanceRecordRepositoryData = {
        asset_id: assetId,
        service,
        expected_at: expected_at ? new Date(expected_at).toISOString().split('T')[0] : null, // Format to YYYY-MM-DD for DATE type
        performed_at: performed_at ? new Date(performed_at).toISOString().split('T')[0] : null,
        description: description ?? null,
        done: done ?? null,
      };

      return await repository.create(repoData);
    } catch (error) {
      throw error;
    }
  },

  getMaintenanceRecordsByAssetId: async (assetId: string, userId: string): Promise<MaintenanceRecord[]> => {
    try {
      await maintenanceRecordsService._verifyAssetOwnership(assetId, userId);
      return await repository.getByAssetId(assetId);
    } catch (error) {
      throw error;
    }
  },

  updateMaintenanceRecord: async (
    maintenanceId: string,
    userId: string,
    data: UpdateMaintenanceRecordRequestBody
  ): Promise<MaintenanceRecord> => {
    try {
      const existingRecord = await repository.getById(maintenanceId);
      if (!existingRecord) {
        const error = new ErrorStatus("Registro de manutenção não encontrado.");
        error.status = 404;
        throw error;
      }
      await maintenanceRecordsService._verifyAssetOwnership(existingRecord.asset_id, userId);

      const updateData: UpdateMaintenanceRecordRequestBody = {};

      if (data.service !== undefined) {
        const service = data.service.trim();
        if (!validateMaintenanceService(service)) {
          const error = new ErrorStatus("Nome do serviço inválido.");
          error.status = 400;
          throw error;
        }
        updateData.service = service;
      }
      if (data.hasOwnProperty('expected_at')) {
        if (data.expected_at && !validateMaintenanceDate(data.expected_at)) {
          const error = new ErrorStatus("Data esperada inválida.");
          error.status = 400;
          throw error;
        }
        updateData.expected_at = data.expected_at ? new Date(data.expected_at).toISOString().split('T')[0] : null;
      }
      if (data.hasOwnProperty('performed_at')) {
        if (data.performed_at && !validateMaintenanceDate(data.performed_at)) {
          const error = new ErrorStatus("Data de realização inválida.");
          error.status = 400;
          throw error;
        }
        updateData.performed_at = data.performed_at ? new Date(data.performed_at).toISOString().split('T')[0] : null;
      }
      if (data.hasOwnProperty('description')) {
        if (data.description !== undefined && data.description !== null && !validateMaintenanceDescription(data.description)) {
          const error = new ErrorStatus("Descrição inválida.");
          error.status = 400;
          throw error;
        }
        updateData.description = data.description;
      }
      if (data.hasOwnProperty('done')) {
        updateData.done = data.done;
      }

      const updatedRecord = await repository.update(maintenanceId, updateData);
      if (!updatedRecord) { // Should not happen if existingRecord was found, unless DB error
        const error = new ErrorStatus("Falha ao atualizar o registro de manutenção.");
        error.status = 500;
        throw error;
      }
      return updatedRecord;
    } catch (error) {
      throw error;
    }
  },

  deleteMaintenanceRecord: async (maintenanceId: string, userId: string): Promise<void> => {
    try {
      const existingRecord = await repository.getById(maintenanceId);
      if (!existingRecord) {
        const error = new ErrorStatus("Registro de manutenção não encontrado.");
        error.status = 404;
        throw error;
      }
      await maintenanceRecordsService._verifyAssetOwnership(existingRecord.asset_id, userId);

      const success = await repository.delete(maintenanceId);
      if (!success) {
        const error = new ErrorStatus("Falha ao excluir o registro de manutenção.");
        error.status = 500; // Or 404 if it was deleted by another process
        throw error;
      }
    } catch (error) {
      throw error;
    }
  },
};

export { maintenanceRecordsService };