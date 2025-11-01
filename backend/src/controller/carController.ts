import { Request, Response } from "express";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../services/carService";
import { CarDto, GetCarsParams } from "../types/cars";

export const getAllCarsController = async (
  req: Request<{}, {}, {}, any>,
  res: Response
) => {
  try {
    const query = req.query;
    const params: GetCarsParams = {
      page: query.page ? Number(query.page) : undefined,
      itemsPerPage: query.itemsPerPage ? Number(query.itemsPerPage) : undefined,
      brand: query.brand as string | undefined,
      customerId: query.customerId as string | undefined,
      orderBy: query.orderBy as
        | "brand"
        | "model"
        | "year"
        | "updatedAt"
        | undefined,
      orderDirection: query.orderDirection as "asc" | "desc" | undefined,
    };
    const cars = await getAllCars(params);
    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get all cars" });
  }
};

export const getCarByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const car = await getCarById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get car by id" });
  }
};

export const createCarController = async (
  req: Request<{}, {}, CarDto>,
  res: Response
) => {
  try {
    const newCar = await createCar(req.body);
    res.status(201).json(newCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create car" });
  }
};

export const updateCarController = async (
  req: Request<{ id: string }, {}, CarDto>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedCar = await updateCar(id, req.body);
    res.status(200).json(updatedCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update car" });
  }
};

export const deleteCarController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedCar = await deleteCar(id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      if (
        error.message.includes("Não é possível excluir") &&
        error.message.includes("nota")
      ) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "Car not found") {
        return res.status(404).json({ message: error.message });
      }
    }
    res.status(500).json({ message: "Failed to delete car" });
  }
};
