import { randomUUID } from "crypto";
import type {
  User,
  Customer,
  Car,
  Part,
  Note,
  PartInNote,
  NoteStatus,
} from "@prisma/client";

type CarWithIncludes = Car & {
  customer?: {
    id: string;
    name: string | null;
  };
  notes?: Note[];
};

type CustomerWithIncludes = Customer & {
  cars?: Car[];
  notes?: Note[];
};

type NoteWithIncludes = Note & {
  customer?: {
    id: string;
    name: string | null;
  };
  car?: {
    id: string;
    brand: string;
    model: string;
    plate?: string | null;
    year?: number | null;
    color: string;
  };
  parts?: (PartInNote & {
    part?: {
      id: string;
      name: string;
      model: string;
      price: number;
    };
  })[];
};

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: randomUUID(),
  name: "John Doe",
  email: "john.doe@example.com",
  password: "123456",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockCustomer = (
  overrides?: Partial<CustomerWithIncludes>
): CustomerWithIncludes => ({
  id: randomUUID(),
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(11) 98765-4321",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockCar = (
  overrides?: Partial<CarWithIncludes>
): CarWithIncludes => ({
  id: randomUUID(),
  customerId: randomUUID(),
  brand: "Ford",
  model: "F150",
  plate: "ABC-1234",
  year: 2020,
  color: "Red",
  createdAt: new Date(),
  updatedAt: new Date(),
  customer: {
    id: randomUUID(),
    name: "John Doe",
  },
  notes: [],
  ...overrides,
});

export const createMockPart = (overrides?: Partial<Part>): Part => ({
  id: randomUUID(),
  name: "Filtro de Óleo",
  model: "FO-123",
  price: 25.99,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockNote = (
  overrides?: Partial<NoteWithIncludes>
): NoteWithIncludes => {
  const customerId = randomUUID();
  const carId = randomUUID();

  return {
    id: randomUUID(),
    customerId,
    carId,
    laborPrice: 150.0,
    partsPrice: 100.0,
    totalPrice: 250.0,
    status: "OPEN" as NoteStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
    customer: {
      id: customerId,
      name: "John Doe",
    },
    car: {
      id: carId,
      brand: "Ford",
      model: "F150",
      plate: "ABC-1234",
      year: 2020,
      color: "Red",
    },
    parts: [],
    ...overrides,
  };
};

export const createMockPartInNote = (
  overrides?: Partial<PartInNote & { part?: Part }>
): PartInNote & { part?: Part } => ({
  id: randomUUID(),
  noteId: randomUUID(),
  partId: randomUUID(),
  quantity: 2,
  price: 25.99,
  createdAt: new Date(),
  updatedAt: new Date(),
  part: {
    id: randomUUID(),
    name: "Filtro de Óleo",
    model: "FO-123",
    price: 25.99,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ...overrides,
});
