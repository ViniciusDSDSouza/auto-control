import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import type { JwtPayload } from "../types/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized", authenticated: false });
  }

  try {
    const decoded = verifyToken(token) as JwtPayload;
    (req as AuthRequest).user = { id: decoded.userId };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", authenticated: false });
  }
};
