import { prisma } from "../db/client";
import { CarDto } from "../types/cars";

export const getAllCars = async () => {
  try {
    const cars = await prisma.car.findMany();
    return cars;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get all cars");
  }
};

export const getCarById = async (id: string) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        notes: true,
      },
    });
    return car;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get car by id");
  }
};

export const createCar = async ({
  customerId,
  brand,
  model,
  plate,
  year,
  color,
  notesId,
}: CarDto) => {
  try {
    const newCar = await prisma.car.create({
      data: {
        customerId,
        brand,
        model,
        plate,
        year,
        color,
        notes: notesId ? { connect: notesId.map((id) => ({ id })) } : undefined,
      },
      include: {
        notes: true,
      },
    });
    return newCar;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create car");
  }
};

export const updateCar = async (
  id: string,
  { customerId, brand, model, plate, year, color, notesId }: CarDto
) => {
  try {
    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        customerId,
        brand,
        model,
        plate,
        year,
        color,
        notes: notesId ? { set: notesId.map((id) => ({ id })) } : undefined,
      },
      include: {
        notes: true,
      },
    });
    return updatedCar;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update car");
  }
};

export const deleteCar = async (id: string) => {
  try {
    await prisma.car.delete({
      where: { id },
    });
    return { message: "Car deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete car");
  }
};
