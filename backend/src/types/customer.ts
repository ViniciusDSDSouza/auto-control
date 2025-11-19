import type { Prisma } from "@prisma/client";

export interface CustomerDto {
  name?: string;
  phone?: string;
  email?: string;
  carsId?: string[];
  notesId?: string[];
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

export type CustomerWhereInput = Prisma.CustomerWhereInput;
export type CustomerOrderByInput = Prisma.CustomerOrderByWithRelationInput;
