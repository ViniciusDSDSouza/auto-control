import { prisma } from "../db/client";
import { PartDto, GetPartsParams, PaginatedResponse } from "../types/part";

export const getAllParts = async ({
  page = 1,
  itemsPerPage = 10,
  name,
  orderBy = "updatedAt",
  orderDirection = "desc",
}: GetPartsParams): Promise<PaginatedResponse<PartDto>> => {
  try {
    const where = name
      ? {
          name: {
            contains: name,
            mode: "insensitive" as const,
          },
        }
      : {};

    const total = await prisma.part.count({ where });

    const parts = await prisma.part.findMany({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        [orderBy]: orderDirection,
      },
      where,
    });

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: parts.map((part) => ({
        id: part.id,
        name: part.name,
        model: part.model,
        price: part.price,
        createdAt: part.createdAt.toISOString(),
        updatedAt: part.updatedAt.toISOString(),
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
    throw new Error("Failed to get all parts");
  }
};

export const getPartById = async (id: string) => {
  try {
    const part = await prisma.part.findUnique({
      where: { id },
    });
    return part;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get part by id");
  }
};

export const createPart = async ({ name, model, price }: PartDto) => {
  try {
    const newPart = await prisma.part.create({
      data: { name, model, price },
    });
    return newPart;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create part");
  }
};

export const updatePart = async (
  id: string,
  { name, model, price }: PartDto
) => {
  try {
    const updatedPart = await prisma.part.update({
      where: { id },
      data: { name, model, price },
    });
    return updatedPart;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update part");
  }
};

export const deletePart = async (id: string) => {
  try {
    await prisma.part.delete({
      where: { id },
    });
    return { message: "Part deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete part");
  }
};
