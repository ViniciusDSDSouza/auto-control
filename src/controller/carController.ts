import { Request, Response } from "express";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../services/carService";
import { CarDto } from "../types/cars";

export const getAllCarsController = async (_req: Request, res: Response) => {
  try {
    const cars = await getAllCars();
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
    res.status(500).json({ message: "Failed to delete car" });
  }
};
