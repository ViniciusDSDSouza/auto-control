import { prisma } from "../db/client";
import {
  NoteDto,
  Note,
  GetNotesParams,
  PaginatedResponse,
} from "../types/note";
import { Prisma } from "@prisma/client";

export const getAllNotes = async ({
  page = 1,
  itemsPerPage = 10,
  customerId,
  carId,
  status,
  dateRangeFrom,
  dateRangeTo,
  orderBy = "updatedAt",
  orderDirection = "desc",
}: GetNotesParams): Promise<PaginatedResponse<Note>> => {
  try {
    const where: Prisma.NoteWhereInput = {};

    if (customerId) {
      where.customerId = customerId;
    }
    if (carId) {
      where.carId = carId;
    }
    if (status) {
      where.status = status;
    }
    if (dateRangeFrom || dateRangeTo) {
      where.createdAt = {};
      if (dateRangeFrom) {
        where.createdAt.gte = new Date(dateRangeFrom);
      }
      if (dateRangeTo) {
        const endDate = new Date(dateRangeTo);
        endDate.setDate(endDate.getDate() + 1);
        where.createdAt.lte = endDate;
      }
    }

    const total = await prisma.note.count({ where });

    const orderByConfig: Prisma.NoteOrderByWithRelationInput = {};
    if (orderBy === "customerId") {
      orderByConfig.customerId = orderDirection;
    } else if (orderBy === "carId") {
      orderByConfig.carId = orderDirection;
    } else if (orderBy === "laborPrice") {
      orderByConfig.laborPrice = orderDirection;
    } else if (orderBy === "totalPrice") {
      orderByConfig.totalPrice = orderDirection;
    } else if (orderBy === "status") {
      orderByConfig.status = orderDirection;
    } else if (orderBy === "createdAt") {
      orderByConfig.createdAt = orderDirection;
    } else {
      orderByConfig.updatedAt = orderDirection;
    }

    const notes = await prisma.note.findMany({
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
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            plate: true,
            year: true,
            color: true,
          },
        },
        parts: {
          include: {
            part: {
              select: {
                id: true,
                name: true,
                model: true,
                price: true,
              },
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      data: notes.map((note) => ({
        id: note.id,
        customerId: note.customerId,
        carId: note.carId,
        laborPrice: note.laborPrice,
        partsPrice: note.partsPrice,
        totalPrice: note.totalPrice,
        status: note.status,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
        customer: note.customer,
        car: note.car
          ? {
              id: note.car.id,
              brand: note.car.brand,
              model: note.car.model,
              plate: note.car.plate ?? undefined,
              year: note.car.year ?? undefined,
              color: note.car.color,
            }
          : undefined,
        parts: note.parts.map((p) => ({
          id: p.id,
          noteId: p.noteId,
          partId: p.partId,
          quantity: p.quantity,
          price: p.price,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
          part: p.part,
        })),
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
    throw new Error("Failed to get all notes");
  }
};

export const getNoteById = async (id: string) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        customer: true,
        car: true,
        parts: true,
      },
    });
    return note;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get note by id");
  }
};

export const createNote = async ({
  customerId,
  carId,
  laborPrice,
  partsPrice,
  totalPrice,
  status,
  parts,
}: NoteDto) => {
  try {
    const newNote = await prisma.note.create({
      data: {
        customerId,
        carId,
        laborPrice,
        partsPrice,
        totalPrice,
        status,
        parts: parts?.length
          ? {
              create: parts.map((p) => ({
                partId: p.partId,
                quantity: p.quantity,
                price: p.price,
              })),
            }
          : undefined,
      },
      include: {
        parts: true,
      },
    });

    return newNote;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create note");
  }
};

export const updateNote = async (
  id: string,
  {
    customerId,
    carId,
    laborPrice,
    partsPrice,
    totalPrice,
    status,
    parts,
  }: NoteDto
) => {
  try {
    await prisma.partInNote.deleteMany({
      where: { noteId: id },
    });

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        customerId,
        carId,
        laborPrice,
        partsPrice,
        totalPrice,
        status,
        parts: parts?.length
          ? {
              create: parts.map((p) => ({
                partId: p.partId,
                quantity: p.quantity,
                price: p.price,
              })),
            }
          : undefined,
      },
      include: { parts: true },
    });

    return updatedNote;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update note");
  }
};

export const deleteNote = async (id: string) => {
  try {
    await prisma.partInNote.deleteMany({
      where: { noteId: id },
    });

    await prisma.note.delete({
      where: { id },
    });
    return { message: "Note deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete note");
  }
};
