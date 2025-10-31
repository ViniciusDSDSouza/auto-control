import { z } from "zod";

export const carSchema = z.object({
  customerId: z.string().min(1, { message: "Cliente é obrigatório" }),
  brand: z.string().min(1, { message: "Marca é obrigatória" }),
  model: z.string().min(1, { message: "Modelo é obrigatório" }),
  plate: z.string().optional(),
  year: z
    .number()
    .int({ message: "Ano deve ser um número inteiro" })
    .refine(
      (val) => {
        if (val === undefined || val === null || val === 0) return true;
        const yearStr = String(val);
        return (
          yearStr.length === 4 &&
          val >= 1900 &&
          val <= new Date().getFullYear() + 1
        );
      },
      {
        message: `Ano deve ter exatamente 4 dígitos e estar entre 1900 e ${
          new Date().getFullYear() + 1
        }`,
      }
    )
    .optional(),
  color: z.string().min(1, { message: "Cor é obrigatória" }),
});

export type CarSchema = z.infer<typeof carSchema>;
