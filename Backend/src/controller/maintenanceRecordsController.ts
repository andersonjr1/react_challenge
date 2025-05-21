import { Request, Response } from 'express';
import { ErrorStatus } from '../utils/error';
import { maintenanceRecordsService as service } from '../service/maintenanceRecordsService';
import { CreateMaintenanceRecordClientBody, UpdateMaintenanceRecordRequestBody } from '../types/maintenance';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

const maintenanceRecordsController = {
  createMaintenanceRecordForAsset: async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { assetId } = req.params;
      const clientBody = req.body as CreateMaintenanceRecordClientBody;

      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado." });
        return;
      }
      const userId = authenticatedReq.user.id;

      const newRecord = await service.createMaintenanceRecord(assetId, userId, clientBody);
      res.status(201).json(newRecord);
    } catch (error) {
      if (error instanceof ErrorStatus) {
        res.status(error.status || 500).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: "Erro ao criar registro de manutenção: " + error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao criar o registro de manutenção." });
      }
    }
  },

  getMaintenanceRecordsForAsset: async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { assetId } = req.params;

      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado." });
        return;
      }
      const userId = authenticatedReq.user.id;

      const records = await service.getMaintenanceRecordsByAssetId(assetId, userId);
      res.status(200).json(records);
    } catch (error) {
      if (error instanceof ErrorStatus) {
        res.status(error.status || 500).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: "Erro ao buscar registros de manutenção: " + error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao buscar os registros de manutenção." });
      }
    }
  },

  updateMaintenanceRecord: async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { maintenanceId } = req.params;
      const updateData = req.body as UpdateMaintenanceRecordRequestBody;

      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado." });
        return;
      }
      const userId = authenticatedReq.user.id;

      const updatedRecord = await service.updateMaintenanceRecord(maintenanceId, userId, updateData);
      res.status(200).json(updatedRecord);
    } catch (error) {
      if (error instanceof ErrorStatus) {
        res.status(error.status || 500).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: "Erro ao atualizar registro de manutenção: " + error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao atualizar o registro de manutenção." });
      }
    }
  },

  deleteMaintenanceRecord: async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { maintenanceId } = req.params;

      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado." });
        return;
      }
      const userId = authenticatedReq.user.id;

      await service.deleteMaintenanceRecord(maintenanceId, userId);
      res.status(200).json({ message: "Registro de manutenção excluído com sucesso." });
    } catch (error) {
      if (error instanceof ErrorStatus) {
        res.status(error.status || 500).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: "Erro ao excluir registro de manutenção: " + error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao excluir o registro de manutenção." });
      }
    }
  },
};

export { maintenanceRecordsController };