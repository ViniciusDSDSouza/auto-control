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
import { healthCheckRoutes } from "./routes/healthCheckRoutes";
import helmet from "helmet";

const allowedOrigins: string[] = [
  process.env.FRONTEND_URL as string,
  "http://localhost:3001",
  "http://localhost:3000",
];

export const app = express();

app.set("trust proxy", true);

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(rateLimiter);

app.use("/", authRoutes);
app.use("/customers", customerRoutes);
app.use("/cars", carRoutes);
app.use("/parts", partRoutes);
app.use("/enum-note-status", enumNoteStatusRoutes);
app.use("/notes", noteRoutes);
app.use("/health-check", healthCheckRoutes);
