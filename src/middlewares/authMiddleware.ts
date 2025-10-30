import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import type { JwtPayload } from "../types/jwt";

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.user.id = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
