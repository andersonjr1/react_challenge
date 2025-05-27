import express from 'express';
import { authController } from '../controller/authController';
import { authToken } from '../middlewares/authMiddleware'; // Import the authToken middleware
const router = express.Router();

router.post("/register", authController.register)
router.post("/login", authController.login)
router.delete("/logout", authController.logout)
router.get("/check-auth", authToken, authController.checkAuthStatus); // New route

export default router