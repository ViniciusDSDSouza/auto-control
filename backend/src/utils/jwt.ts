import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/jwt";

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId: string) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
