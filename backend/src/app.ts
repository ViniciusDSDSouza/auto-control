import express from "express";
import { authRoutes } from "./routes/authRoutes";
import { customerRoutes } from "./routes/customerRoutes";
import { carRoutes } from "./routes/carRoutes";
import { partRoutes } from "./routes/partRoutes";
import { enumNoteStatusRoutes } from "./routes/enumNoteStatusRoutes";
import { noteRoutes } from "./routes/noteRoutes";

export const app = express();
app.use(express.json());

app.use("/", authRoutes);
app.use("/customers", customerRoutes);
app.use("/cars", carRoutes);
app.use("/parts", partRoutes);
app.use("/enum-note-status", enumNoteStatusRoutes);
app.use("/notes", noteRoutes);
