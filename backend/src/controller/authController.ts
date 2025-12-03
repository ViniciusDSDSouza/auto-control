import { registerUser, loginUser } from "../services/authService";
import { Request, Response } from "express";
import { RegisterUserDto, LoginUserDto } from "../types/user";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecure = process.env.COOKIE_SECURE === "true" || isProduction;
  const sameSite =
    isProduction && isSecure ? "none" : isProduction ? "lax" : "strict";

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite as "strict" | "lax" | "none",
    path: "/",
  };
};

const clearTokenCookie = (res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecure = process.env.COOKIE_SECURE === "true" || isProduction;

  // Lista todas as possíveis combinações de configurações de cookie
  // que podem ter sido usadas anteriormente
  const possibleConfigs: Array<{
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax" | "strict";
    path: string;
  }> = [
    // Configurações de produção (HTTPS)
    { httpOnly: true, secure: true, sameSite: "none", path: "/" },
    { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
    { httpOnly: true, secure: true, sameSite: "strict", path: "/" },
    // Configurações de desenvolvimento (HTTP)
    { httpOnly: true, secure: false, sameSite: "lax", path: "/" },
    { httpOnly: true, secure: false, sameSite: "strict", path: "/" },
  ];

  // Limpa com todas as configurações possíveis
  // O Express só vai limpar cookies que realmente existem com essas configurações
  possibleConfigs.forEach((config) => {
    res.clearCookie("token", config);
  });
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

    const cookieOptions = getCookieOptions();

    // Limpa cookies antigos antes de setar o novo
    clearTokenCookie(res);

    // Seta o novo cookie com a configuração correta
    res.cookie("token", result, {
      ...cookieOptions,
      maxAge: 12 * 60 * 60 * 1000, // 12 horas
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login user" });
  }
};

export const logoutController = async (_req: Request, res: Response) => {
  // Limpa todos os cookies possíveis com todas as configurações
  clearTokenCookie(res);

  res.status(200).json({ message: "Logout successful" });
};

export const checkAuthController = async (_req: Request, res: Response) => {
  res.status(200).json({ authenticated: true });
};
