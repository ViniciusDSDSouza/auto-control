import { Router } from "express";
import { healthCheckController } from "../controller/health-check";

export const healthCheckRoutes = Router();

healthCheckRoutes.get("/", healthCheckController);
