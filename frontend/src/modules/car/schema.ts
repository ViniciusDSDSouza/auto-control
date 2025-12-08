import { z } from "zod";

export const carSchema = z.object({
  customerId: z.string().min(1, { message: "Cliente é obrigatório" }),
  brand: z.string().min(1, { message: "Marca é obrigatória" }),
  model: z.string().min(1, { message: "Modelo é obrigatório" }),
  plate: z.string().optional(),
  year: z.union([z.number(), z.nan()]).optional(),
  color: z.string().min(1, { message: "Cor é obrigatória" }),
});

export type CarSchema = z.infer<typeof carSchema>;
