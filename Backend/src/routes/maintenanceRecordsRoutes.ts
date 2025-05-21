import express from 'express';
import { maintenanceRecordsController } from '../controller/maintenanceRecordsController';
// import { yourAuthMiddleware } from '../middleware/authMiddleware'; // Ensure this is your actual auth middleware

const router = express.Router();

// Apply authentication middleware to all maintenance routes
// router.use(yourAuthMiddleware); // Make sure to uncomment and use your actual authentication middleware
router.put("/:maintenanceId", maintenanceRecordsController.updateMaintenanceRecord);
router.delete("/:maintenanceId", maintenanceRecordsController.deleteMaintenanceRecord);

export default router;