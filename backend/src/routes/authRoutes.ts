import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
} from "../controller/authController";
import { authRateLimiter } from "../utils/rateLimiter";

export const authRoutes = Router();

authRoutes.post("/register", authRateLimiter, registerController);
authRoutes.post("/login", authRateLimiter, loginController);
authRoutes.post("/logout", logoutController);
