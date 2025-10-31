export interface CustomerDto {
  name: string;
  phone?: string;
  email?: string;
}

export interface Customer extends CustomerDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}
