export interface PartDto {
  name: string;
  model: string;
  price: number;
}

export interface Part extends PartDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetPartsParams {
  page?: number;
  itemsPerPage?: number;
  name?: string;
  orderBy?: "name" | "model" | "price" | "updatedAt";
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
