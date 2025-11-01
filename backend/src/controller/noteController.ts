import { Request, Response } from "express";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import { NoteDto, GetNotesParams } from "../types/note";
import { NoteStatus } from "@prisma/client";

export const getAllNotesController = async (req: Request, res: Response) => {
  try {
    const {
      page,
      itemsPerPage,
      customerId,
      carId,
      status,
      dateRangeFrom,
      dateRangeTo,
      orderBy,
      orderDirection,
    } = req.query;

    const params: GetNotesParams = {};
    if (page) params.page = parseInt(page as string, 10);
    if (itemsPerPage)
      params.itemsPerPage = parseInt(itemsPerPage as string, 10);
    if (customerId) params.customerId = customerId as string;
    if (carId) params.carId = carId as string;
    if (status) params.status = status as NoteStatus;
    if (dateRangeFrom) params.dateRangeFrom = dateRangeFrom as string;
    if (dateRangeTo) params.dateRangeTo = dateRangeTo as string;
    if (orderBy) params.orderBy = orderBy as GetNotesParams["orderBy"];
    if (orderDirection)
      params.orderDirection = orderDirection as "asc" | "desc";

    const notes = await getAllNotes(params);
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
