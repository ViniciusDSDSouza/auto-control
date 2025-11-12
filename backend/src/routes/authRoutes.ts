import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  checkAuthController,
} from "../controller/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", authMiddleware, logoutController);
authRoutes.get("/check-auth", authMiddleware, checkAuthController);
