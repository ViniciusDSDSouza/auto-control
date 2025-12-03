import { registerUser, loginUser } from "../services/authService";
import { Request, Response } from "express";
import { RegisterUserDto, LoginUserDto } from "../types/user";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const isSecure = process.env.COOKIE_SECURE === "true" || isProduction;
  // Em produção com HTTPS: "none" para cross-origin (Vercel -> Render)
  // Em produção sem HTTPS ou dev: "lax"
  // Nunca usar "strict" pois não funciona bem em cross-origin
  const sameSite = isProduction && isSecure ? "none" : "lax";

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite as "lax" | "none",
    path: "/",
  };
};

const clearTokenCookie = (res: Response) => {
  // Lista apenas as configurações que realmente podem ter sido usadas
  // Removido "strict" pois não deve ser usado em produção e cria cookies fantasmas
  const possibleConfigs: Array<{
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax";
    path: string;
  }> = [
    // Configurações de produção (HTTPS) - cross-origin
    { httpOnly: true, secure: true, sameSite: "none", path: "/" },
    // Configurações de produção (HTTPS) - same-origin
    { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
    // Configurações de desenvolvimento (HTTP)
    { httpOnly: true, secure: false, sameSite: "lax", path: "/" },
  ];

  // Limpa apenas com as configurações relevantes
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
