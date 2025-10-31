import { Router } from "express";
import {
  createCustomerController,
  deleteCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
} from "../controller/customerController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const customerRoutes = Router();

customerRoutes.get("/", authMiddleware, getAllCustomersController);
customerRoutes.get("/:id", authMiddleware, getCustomerByIdController);
customerRoutes.post("/", authMiddleware, createCustomerController);
customerRoutes.put("/:id", authMiddleware, updateCustomerController);
customerRoutes.delete("/:id", authMiddleware, deleteCustomerController);
