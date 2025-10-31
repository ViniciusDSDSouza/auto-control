import { Router } from "express";
import { getEnumNoteStatusController } from "../controller/enumNoteStatusController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const enumNoteStatusRoutes = Router();

enumNoteStatusRoutes.get("/", authMiddleware, getEnumNoteStatusController);
