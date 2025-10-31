import { Router } from "express";
import {
  createCarController,
  deleteCarController,
  getAllCarsController,
  getCarByIdController,
  updateCarController,
} from "../controller/carController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const carRoutes = Router();

carRoutes.get("/", authMiddleware, getAllCarsController);
carRoutes.get("/:id", authMiddleware, getCarByIdController);
carRoutes.post("/", authMiddleware, createCarController);
carRoutes.put("/:id", authMiddleware, updateCarController);
carRoutes.delete("/:id", authMiddleware, deleteCarController);
