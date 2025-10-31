import { Request, Response } from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";
import { CustomerDto, GetCustomersParams } from "../types/customer";

export const getAllCustomersController = async (
  req: Request<{}, {}, GetCustomersParams>,
  res: Response
) => {
  const { page, itemsPerPage, name, orderBy, orderDirection } = req.query;

  try {
    const customers = await getAllCustomers({
      page: page ? Number(page) : undefined,
      itemsPerPage: itemsPerPage ? Number(itemsPerPage) : undefined,
      name: name as string,
      orderBy: orderBy as "name" | "email" | "phone" | "updatedAt",
      orderDirection: orderDirection as "asc" | "desc",
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get all customers" });
  }
};

export const getCustomerByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const customer = await getCustomerById(id);

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get customer" });
  }
};

export const createCustomerController = async (
  req: Request<{}, {}, CustomerDto>,
  res: Response
) => {
  try {
    const { name, phone, email, carsId, notesId } = req.body;

    const newCustomer = await createCustomer({
      name,
      phone,
      email,
      carsId,
      notesId,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create customer" });
  }
};

export const updateCustomerController = async (
  req: Request<{ id: string }, {}, CustomerDto>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, phone, email, carsId, notesId } = req.body;

    const updatedCustomer = await updateCustomer(id, {
      name,
      phone,
      email,
      carsId,
      notesId,
    });

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update customer" });
  }
};

export const deleteCustomerController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await deleteCustomer(id);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete customer" });
  }
};
