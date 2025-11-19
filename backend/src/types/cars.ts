import type { Prisma } from "@prisma/client";

export interface CarDto {
  customerId: string;
  brand: string;
  model: string;
  plate?: string;
  year?: number;
  color: string;
}

export interface Car extends CarDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string | null;
  };
}

export interface GetCarsParams {
  page?: number;
  itemsPerPage?: number;
  brand?: string;
  customerId?: string;
  orderBy?: "brand" | "model" | "year" | "updatedAt";
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

export type CarWhereInput = Prisma.CarWhereInput;
export type CarOrderByInput = Prisma.CarOrderByWithRelationInput;
