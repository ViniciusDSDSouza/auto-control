import { registerUser, loginUser } from "../services/authService";
import { Request, Response } from "express";
import { RegisterUserDto, LoginUserDto } from "../types/user";

export const registerController = async (
  req: Request<{}, {}, RegisterUserDto>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser({ name, email, password });

    res.status(201).json(result);
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

    res.status(200).json({ token: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login user" });
  }
};
