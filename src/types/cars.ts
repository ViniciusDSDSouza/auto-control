export interface CarDto {
  customerId: string;
  brand: string;
  model: string;
  plate?: string;
  year?: number;
  color: string;
  notesId?: string[];
}
