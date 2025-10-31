import { prisma } from "../db/client";
import { NoteDto } from "../types/note";

export const getAllNotes = async () => {
  try {
    const notes = await prisma.note.findMany({
      include: {
        customer: true,
        car: true,
        parts: true,
      },
    });
    return notes;
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
    await prisma.note.delete({
      where: { id },
    });
    return { message: "Note deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete note");
  }
};
