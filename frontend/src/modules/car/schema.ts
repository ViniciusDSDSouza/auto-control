import { z } from "zod";

export const carSchema = z.object({
  customerId: z.string().min(1, { message: "Cliente é obrigatório" }),
  brand: z.string().min(1, { message: "Marca é obrigatória" }),
  model: z.string().min(1, { message: "Modelo é obrigatório" }),
  plate: z.string().optional(),
  year: z
    .number({ message: "Ano deve ser um número válido" })
    .int({ message: "Ano deve ser um número inteiro" })
    .min(1900, { message: "Ano deve ser maior ou igual a 1900" })
    .max(new Date().getFullYear() + 1, {
      message: `Ano deve ser menor ou igual a ${new Date().getFullYear() + 1}`,
    })
    .optional(),
  color: z.string().min(1, { message: "Cor é obrigatória" }),
});

export type CarSchema = z.infer<typeof carSchema>;
