import { Request, Response } from 'express';
import { ErrorStatus } from '../utils/error';
import { assetsService as service } from '../service/assetsService';
import { CreateAssetRequestBody, UpdateAssetRequestBody } from '../types/assets';

/**
 * Extends the Express Request interface to include the `user` object,
 * which is expected to be populated by an authentication middleware.
 * Assumes `user` object contains at least an `id`.
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    // Include other properties from your JWT payload if needed
    [key: string]: any;
  };
}

const assetsController = {
  /**
   * Creates a new asset for the authenticated user.
   */
  createAsset: async (req: Request, res: Response): Promise<void> => {
    try {
      // Cast req to AuthenticatedRequest to access the user property
      const authenticatedReq = req as AuthenticatedRequest;
      const { name, description } = req.body as Omit<CreateAssetRequestBody, 'user_id'>;

      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado ou ID do usuário ausente." });
        return;
      }
      const user_id = authenticatedReq.user.id;

      const assetData: CreateAssetRequestBody = { user_id, name, description };
      const newAsset = await service.createAsset(assetData);
      res.status(201).json(newAsset);
    } catch (error) {
      if (error instanceof ErrorStatus) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao criar o ativo." });
      }
    }
  },

  /**
   * Retrieves all assets belonging to the authenticated user.
   */
  getAssetsByUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado ou ID do usuário ausente." });
        return;
      }
      const userId = authenticatedReq.user.id;
      const assets = await service.getAssetsByUserId(userId);
      res.status(200).json(assets);
    } catch (error) {
      if (error instanceof ErrorStatus) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao buscar os ativos." });
      }
    }
  },

  /**
   * Retrieves a specific asset by its ID, ensuring it belongs to the authenticated user.
   */
  getAssetById: async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { id: assetId } = req.params;
      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado ou ID do usuário ausente." });
        return;
      }
      const userId = authenticatedReq.user.id;

      const asset = await service.getAssetById(assetId); // Service throws 404 if not found by ID

      if (asset.user_id !== userId) {
        res.status(403).json({ message: "Você não tem permissão para acessar este ativo." });
        return;
      }
      res.status(200).json(asset);
    } catch (error) {
      if (error instanceof ErrorStatus) {
        const statusCode = error.status || 500;
        // If service threw 404, it will be caught here.
        res.status(statusCode).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao buscar o ativo." });
      }
    }
  },

  /**
   * Updates an asset, ensuring it belongs to the authenticated user.
   */
  updateAsset: async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { id: assetId } = req.params;
      const updateData = req.body as UpdateAssetRequestBody;

      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado ou ID do usuário ausente." });
        return;
      }
      const userId = authenticatedReq.user.id;

      // Ownership check: Fetch asset first to verify user_id
      const existingAsset = await service.getAssetById(assetId);
      if (existingAsset.user_id !== userId) {
        res.status(403).json({ message: "Você não tem permissão para atualizar este ativo." });
        return;
      }

      const updatedAsset = await service.updateAsset(assetId, updateData);
      res.status(200).json(updatedAsset);
    } catch (error) {
      if (error instanceof ErrorStatus) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao atualizar o ativo." });
      }
    }
  },

  /**
   * Deletes an asset, ensuring it belongs to the authenticated user.
   */
  deleteAsset: async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { id: assetId } = req.params;
      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({ message: "Usuário não autenticado ou ID do usuário ausente." });
        return;
      }
      const userId = authenticatedReq.user.id;

      // Ownership check: Fetch asset first to verify user_id
      const existingAsset = await service.getAssetById(assetId);
      if (existingAsset.user_id !== userId) {
        res.status(403).json({ message: "Você não tem permissão para excluir este ativo." });
        return;
      }

      await service.deleteAsset(assetId);
      res.status(200).json({ message: "Ativo excluído com sucesso." });
    } catch (error) {
      if (error instanceof ErrorStatus) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado ao excluir o ativo." });
      }
    }
  }
};

export { assetsController };