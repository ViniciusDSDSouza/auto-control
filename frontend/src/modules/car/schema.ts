import { z } from "zod";

export const carSchema = z.object({
  customerId: z.string().min(1, { message: "Cliente é obrigatório" }),
  brand: z.string().min(1, { message: "Marca é obrigatória" }),
  model: z.string().min(1, { message: "Modelo é obrigatório" }),
  plate: z.string().optional(),
  year: z
    .preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      },
      z
        .number({ message: "Ano deve ser um número válido" })
        .int({ message: "Ano deve ser um número inteiro" })
        .refine((val) => !isNaN(val), {
          message: "Ano deve ser um número válido",
        })
        .refine((val) => val >= 1900 && val <= new Date().getFullYear() + 1, {
          message: `Ano deve estar entre 1900 e ${
            new Date().getFullYear() + 1
          }`,
        })
        .optional()
    )
    .optional(),
  color: z.string().min(1, { message: "Cor é obrigatória" }),
});

export type CarSchema = z.infer<typeof carSchema>;
