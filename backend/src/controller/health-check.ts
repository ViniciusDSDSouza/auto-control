import { Request, Response } from "express";

export const healthCheckController = async (_req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Server is running" });
  } catch (error) {
    res.status(500).json({ message: "Server is not running" });
  }
};
