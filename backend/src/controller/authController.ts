import { registerUser, loginUser } from "../services/authService";
import { Request, Response } from "express";
import { RegisterUserDto, LoginUserDto } from "../types/user";

const getCookieOptions = (req?: Request) => {
  // Detecta se está em HTTPS baseado no request
  const isSecure = req?.secure || req?.headers['x-forwarded-proto'] === 'https';
  
  return {
    httpOnly: true,
    secure: isSecure, // true apenas em HTTPS, false em HTTP (desenvolvimento)
    sameSite: "lax" as const, // "lax" funciona melhor no mobile que "none"
    path: "/",
  };
};

const clearTokenCookie = (res: Response, req?: Request) => {
  const cookieOptions = getCookieOptions(req);
  res.clearCookie("token", cookieOptions);
};

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

    const cookieOptions = getCookieOptions(req);

    clearTokenCookie(res, req);

    res.cookie("token", result, {
      ...cookieOptions,
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login user" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  clearTokenCookie(res, req);

  res.status(200).json({ message: "Logout successful" });
};

export const checkAuthController = async (_req: Request, res: Response) => {
  res.status(200).json({ authenticated: true });
};
