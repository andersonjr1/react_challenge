import express from 'express';
import { authController } from '../controller/authController';
const router = express.Router();

router.post("/register", authController.register)
router.post("/login", authController.login)
router.delete("/logout", authController.logout)

export default router