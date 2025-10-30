import { prisma } from "../db/client";
import { CustomerDto } from "../types/customer";

export const getAllCustomers = async () => {
  try {
    const customers = await prisma.customer.findMany();
    return customers;
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
    await prisma.customer.delete({
      where: { id },
    });

    return { message: "Customer deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete customer");
  }
};
