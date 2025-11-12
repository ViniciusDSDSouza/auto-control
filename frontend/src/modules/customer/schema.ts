import { z } from "zod";

export const customerSchema = z
  .object({
    name: z.string().optional(),
    email: z
      .union([z.string().email({ message: "E-mail inválido" }), z.literal("")])
      .optional(),
    phone: z
      .string()
      .refine(
        (val) => {
          if (!val || val === "") return true;
          const numbers = val.replace(/\D/g, "");
          return numbers.length === 10 || numbers.length === 11;
        },
        { message: "Telefone deve ter 10 ou 11 dígitos" }
      )
      .optional(),
  })
  .refine(
    (data) => {
      const hasName = data.name && data.name.trim() !== "";
      const hasPhone = data.phone && data.phone.trim() !== "";
      return hasName || hasPhone;
    },
    {
      message: "Preencha pelo menos o nome ou o telefone do cliente",
      path: ["name"],
    }
  );

export type CustomerSchema = z.infer<typeof customerSchema>;
