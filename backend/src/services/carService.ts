import { prisma } from "../db/client";
import { Car, CarDto, GetCarsParams, PaginatedResponse } from "../types/cars";

export const getAllCars = async ({
  page = 1,
  itemsPerPage = 10,
  brand,
  customerId,
  orderBy = "updatedAt",
  orderDirection = "desc",
}: GetCarsParams): Promise<PaginatedResponse<Car>> => {
  try {
    const where: any = {};

    if (brand) {
      where.brand = {
        contains: brand,
        mode: "insensitive" as const,
      };
    }

    if (customerId) {
      where.customerId = customerId;
    }

    const total = await prisma.car.count({ where });

    const orderByConfig: any = {};
    if (orderBy === "year") {
      orderByConfig.year = orderDirection;
    } else if (orderBy === "brand") {
      orderByConfig.brand = orderDirection;
    } else if (orderBy === "model") {
      orderByConfig.model = orderDirection;
    } else {
      orderByConfig.updatedAt = orderDirection;
    }

    const cars = await prisma.car.findMany({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: orderByConfig,
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: cars.map((car) => ({
        id: car.id,
        customerId: car.customerId,
        brand: car.brand,
        model: car.model,
        plate: car.plate ?? undefined,
        year: car.year ?? undefined,
        color: car.color,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString(),
        customer: car.customer,
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
  { customerId, brand, model, plate, year, color }: CarDto
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
