import express from "express";
import { authRoutes } from "./routes/authRoutes";
import { customerRoutes } from "./routes/customerRoutes";
import { carRoutes } from "./routes/carRoutes";
import { partRoutes } from "./routes/partRoutes";

export const app = express();
app.use(express.json());

app.use("/", authRoutes);
app.use("/customers", customerRoutes);
app.use("/cars", carRoutes);
app.use("/parts", partRoutes);
