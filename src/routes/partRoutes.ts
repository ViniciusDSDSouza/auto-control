import { Router } from "express";
import {
  getAllPartsController,
  getPartByIdController,
  createPartController,
  updatePartController,
  deletePartController,
} from "../controller/partController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const partRoutes = Router();

partRoutes.get("/", authMiddleware, getAllPartsController);
partRoutes.get("/:id", authMiddleware, getPartByIdController);
partRoutes.post("/", authMiddleware, createPartController);
partRoutes.put("/:id", authMiddleware, updatePartController);
partRoutes.delete("/:id", authMiddleware, deletePartController);
