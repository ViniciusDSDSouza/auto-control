import { prisma } from "../db/client";
import {
  CustomerDto,
  GetCustomersParams,
  PaginatedResponse,
} from "../types/customer";

export const getAllCustomers = async ({
  page = 1,
  itemsPerPage = 10,
  name,
  orderBy = "updatedAt",
  orderDirection = "desc",
}: GetCustomersParams): Promise<PaginatedResponse<CustomerDto>> => {
  try {
    const where = name
      ? {
          name: {
            contains: name,
            mode: "insensitive" as const,
          },
        }
      : {};

    const total = await prisma.customer.count({ where });

    const customers = await prisma.customer.findMany({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        [orderBy]: orderDirection,
      },
      where,
    });

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone ?? undefined,
        email: customer.email ?? undefined,
      })),
      pagination: {
        page,
        itemsPerPage,
        totalItems: total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get all customers");
  }
};

export const getCustomerById = async (id: string) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        cars: true,
        notes: true,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get customer");
  }
};

export const createCustomer = async ({
  name,
  phone,
  email,
  carsId,
  notesId,
}: CustomerDto) => {
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        phone,
        email,
        cars: carsId ? { connect: carsId.map((id) => ({ id })) } : undefined,
        notes: notesId ? { connect: notesId.map((id) => ({ id })) } : undefined,
      },
    });
    return newCustomer;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create customer");
  }
};

export const updateCustomer = async (
  id: string,
  { name, phone, email, carsId, notesId }: CustomerDto
) => {
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        phone,
        email,
        cars: carsId ? { set: carsId.map((id) => ({ id })) } : undefined,
        notes: notesId ? { set: notesId.map((id) => ({ id })) } : undefined,
      },
      include: {
        cars: true,
        notes: true,
      },
    });

    return updatedCustomer;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update customer");
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        cars: true,
        notes: true,
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const carsCount = customer.cars.length;
    const notesCount = customer.notes.length;

    if (carsCount > 0 || notesCount > 0) {
      const parts: string[] = [];
      if (carsCount > 0) {
        parts.push(`${carsCount} veículo${carsCount > 1 ? "s" : ""}`);
      }
      if (notesCount > 0) {
        parts.push(`${notesCount} nota${notesCount > 1 ? "s" : ""}`);
      }

      throw new Error(
        `Não é possível excluir ${customer.name}. O cliente possui ${parts.join(
          " e "
        )} cadastrado${carsCount + notesCount > 1 ? "s" : ""}.`
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return { message: "Customer deleted successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error(error);
    throw new Error("Failed to delete customer");
  }
};
