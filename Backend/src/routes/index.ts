import express from 'express';
import authRoutes from './authRoutes';
import assetsRoutes from './assetsRoutes';
import maintenanceRecordsRoutes from './maintenanceRecordsRoutes';
import { authToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authRoutes)
router.use("/ativos", authToken, assetsRoutes)
router.use("/manutencoes", authToken, maintenanceRecordsRoutes)


export default router