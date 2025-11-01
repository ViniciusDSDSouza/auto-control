import { z } from "zod";

export const partSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  model: z.string().min(1, { message: "Modelo é obrigatório" }),
  price: z
    .number({
      message: "Preço é obrigatório",
    })
    .refine((val) => !isNaN(val), {
      message: "Preço é obrigatório",
    })
    .refine((val) => val > 0, {
      message: "Preço é obrigatório",
    }),
});

export type PartSchema = z.infer<typeof partSchema>;
