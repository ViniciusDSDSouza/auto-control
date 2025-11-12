import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes";
import { customerRoutes } from "./routes/customerRoutes";
import { carRoutes } from "./routes/carRoutes";
import { partRoutes } from "./routes/partRoutes";
import { enumNoteStatusRoutes } from "./routes/enumNoteStatusRoutes";
import { noteRoutes } from "./routes/noteRoutes";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./utils/rateLimiter";
import helmet from "helmet";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(rateLimiter);

app.use(helmet());

app.use("/", authRoutes);
app.use("/customers", customerRoutes);
app.use("/cars", carRoutes);
app.use("/parts", partRoutes);
app.use("/enum-note-status", enumNoteStatusRoutes);
app.use("/notes", noteRoutes);
