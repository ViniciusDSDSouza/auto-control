import { prisma } from "../db/client";
import { PartDto } from "../types/part";

export const getAllParts = async () => {
  try {
    const parts = await prisma.part.findMany();
    return parts;
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
