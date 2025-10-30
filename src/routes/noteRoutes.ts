import { Router } from "express";
import {
  getAllNotesController,
  getNoteByIdController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
} from "../controller/noteController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const noteRoutes = Router();

noteRoutes.get("/", authMiddleware, getAllNotesController);
noteRoutes.get("/:id", authMiddleware, getNoteByIdController);
noteRoutes.post("/", authMiddleware, createNoteController);
noteRoutes.put("/:id", authMiddleware, updateNoteController);
noteRoutes.delete("/:id", authMiddleware, deleteNoteController);
