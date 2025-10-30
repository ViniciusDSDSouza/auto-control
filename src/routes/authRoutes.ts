import { Router } from "express";
import {
  registerController,
  loginController,
} from "../controller/authController";

export const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
