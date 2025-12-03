import { registerUser, loginUser } from "../services/authService";
import { Request, Response } from "express";
import { RegisterUserDto, LoginUserDto } from "../types/user";

export const registerController = async (
  req: Request<{}, {}, RegisterUserDto>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;
    await registerUser({ name, email, password });

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao registrar usuário";
    res.status(500).json({ message });
  }
};

export const loginController = async (
  req: Request<{}, {}, LoginUserDto>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    const isProduction = process.env.NODE_ENV === "production";
    const isSecure = process.env.COOKIE_SECURE === "true" || isProduction;
    const sameSite =
      isProduction && isSecure ? "none" : isProduction ? "lax" : "strict";

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "lax" });
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.cookie("token", result, {
      httpOnly: true,
      secure: isSecure,
      maxAge: 12 * 60 * 60 * 1000,
      sameSite: sameSite as "strict" | "lax" | "none",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login user" });
  }
};

export const logoutController = async (_req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecure = process.env.COOKIE_SECURE === "true" || isProduction;
  const sameSite =
    isProduction && isSecure ? "none" : isProduction ? "lax" : "strict";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite as "strict" | "lax" | "none",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const checkAuthController = async (_req: Request, res: Response) => {
  res.status(200).json({ authenticated: true });
};
