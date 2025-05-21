import express from 'express';
import { assetsController } from '../controller/assetsController';
import { maintenanceRecordsController } from '../controller/maintenanceRecordsController';


const router = express.Router();

// Apply authentication middleware to all asset routes
// router.use(yourAuthMiddleware); // Uncomment and use your actual authentication middleware here

router.get("/", assetsController.getAssetsByUser);
router.post("/", assetsController.createAsset);
router.get("/:id", assetsController.getAssetById);
router.put("/:id", assetsController.updateAsset);
router.delete("/:id", assetsController.deleteAsset);
router.get("/:assetId/manutencoes", maintenanceRecordsController.getMaintenanceRecordsForAsset);
router.post("/:assetId/manutencoes", maintenanceRecordsController.createMaintenanceRecordForAsset);

export default router