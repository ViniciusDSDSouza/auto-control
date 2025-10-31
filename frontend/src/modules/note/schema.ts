import { z } from "zod";
import { NoteStatus } from "./types";

export const partInNoteSchema = z.object({
  partId: z.string().min(1, { message: "Peça é obrigatória" }),
  quantity: z
    .number()
    .int({ message: "Quantidade deve ser um número inteiro" })
    .min(1, { message: "Quantidade deve ser maior que zero" }),
  price: z.number().min(0, { message: "Preço deve ser maior ou igual a zero" }),
});

export const noteSchema = z.object({
  customerId: z.string().min(1, { message: "Cliente é obrigatório" }),
  carId: z.string().min(1, { message: "Carro é obrigatório" }),
  laborPrice: z
    .number()
    .min(0, { message: "Preço da mão de obra deve ser maior ou igual a zero" }),
  status: z.nativeEnum(NoteStatus, {
    message: "Status inválido",
  }),
  parts: z.array(partInNoteSchema).optional(),
});

export type NoteSchema = z.infer<typeof noteSchema>;
export type PartInNoteSchema = z.infer<typeof partInNoteSchema>;
