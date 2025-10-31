import { z } from "zod";

export const partSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  model: z.string().min(1, { message: "Modelo é obrigatório" }),
  price: z.number().positive({ message: "Preço deve ser maior que zero" }),
});

export type PartSchema = z.infer<typeof partSchema>;
