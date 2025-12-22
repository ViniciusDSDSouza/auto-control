export interface CustomerDto {
  name?: string;
  phone?: string;
  email?: string;
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

export interface CustomerNote {
  id: string;
  customerId: string;
  carId: string;
  laborPrice: number;
  partsPrice: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
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

export interface Customer extends CustomerDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  cars?: Array<{
    id: string;
    customerId: string;
    brand: string;
    model: string;
    plate?: string;
    year?: number;
    color: string;
    createdAt: string;
    updatedAt: string;
  }>;
  notes?: CustomerNote[];
}

export interface GetCustomersParams {
  page?: number;
  itemsPerPage?: number;
  name?: string;
  phone?: string;
  orderBy?: "name" | "email" | "phone" | "updatedAt";
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
