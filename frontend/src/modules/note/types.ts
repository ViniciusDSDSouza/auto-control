export enum NoteStatus {
  OPEN = "OPEN",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export interface PartInNoteDto {
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

export interface PartInNote {
  id: string;
  noteId: string;
  partId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  part?: {
    id: string;
    name: string;
    model: string;
    price: number;
  };
}

export interface Note {
  id: string;
  customerId: string;
  carId: string;
  laborPrice: number;
  partsPrice: number;
  totalPrice: number;
  status: NoteStatus;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
  };
  car?: {
    id: string;
    brand: string;
    model: string;
    plate?: string;
    year?: number;
    color: string;
  };
  parts?: PartInNote[];
}

export interface GetNotesParams {
  page?: number;
  itemsPerPage?: number;
  customerId?: string;
  carId?: string;
  status?: NoteStatus;
  orderBy?:
    | "customerId"
    | "carId"
    | "laborPrice"
    | "totalPrice"
    | "status"
    | "updatedAt"
    | "createdAt";
  orderDirection?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
