import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "E-mail inválido" }),
    password: z
      .string()
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
