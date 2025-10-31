import { Request, Response } from "express";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import { NoteDto } from "../types/note";

export const getAllNotesController = async (_req: Request, res: Response) => {
  try {
    const notes = await getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get all notes" });
  }
};

export const getNoteByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await getNoteById(id);
    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get note by id" });
  }
};

export const createNoteController = async (
  req: Request<{}, {}, NoteDto>,
  res: Response
) => {
  try {
    const { customerId, carId, laborPrice, status, parts } = req.body;

    const partsPrice =
      parts?.reduce((sum, part) => sum + part.price * part.quantity, 0) ?? 0;

    const totalPrice = laborPrice + partsPrice;

    const newNote = await createNote({
      customerId,
      carId,
      laborPrice,
      partsPrice,
      totalPrice,
      status,
      parts,
    });
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create note" });
  }
};

export const updateNoteController = async (
  req: Request<{ id: string }, {}, NoteDto>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { customerId, carId, laborPrice, status, parts } = req.body;

    const partsPrice =
      parts?.reduce((sum, part) => sum + part.price * part.quantity, 0) ?? 0;

    const totalPrice = laborPrice + partsPrice;

    const updatedNote = await updateNote(id, {
      customerId,
      carId,
      laborPrice,
      partsPrice,
      totalPrice,
      status,
      parts,
    });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update note" });
  }
};

export const deleteNoteController = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedNote = await deleteNote(id);
    res.status(200).json(deletedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};
