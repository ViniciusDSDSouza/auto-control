import express from "express";
import { authRoutes } from "./routes/authRoutes";

export const app = express();
app.use(express.json());
app.use("/", authRoutes);
