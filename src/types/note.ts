import { NoteStatus } from "@prisma/client";

interface PartInNoteDto {
  partId: string;
  quantity: number;
  price: number;
}

export interface NoteDto {
  customerId: string;
  carId: string;
  laborPrice: number;
  partsPrice: number;
  totalPrice: number;
  status: NoteStatus;
  parts?: PartInNoteDto[];
}
