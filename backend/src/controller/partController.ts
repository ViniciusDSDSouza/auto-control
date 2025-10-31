import { Request, Response } from "express";
import {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
} from "../services/partService";
import { PartDto } from "../types/part";

export const getAllPartsController = async (_req: Request, res: Response) => {
  try {
    const parts = await getAllParts();
    res.status(200).json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get all parts" });
  }
};

export const getPartByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const part = await getPartById(id);
    res.status(200).json(part);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Part not found" });
  }
};

export const createPartController = async (
  req: Request<{}, {}, PartDto>,
  res: Response
) => {
  try {
    const newPart = await createPart(req.body);
    res.status(201).json(newPart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create part" });
  }
};

export const updatePartController = async (
  req: Request<{ id: string }, {}, PartDto>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedPart = await updatePart(id, req.body);
    res.status(200).json(updatedPart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update part" });
  }
};

export const deletePartController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedPart = await deletePart(id);
    res.status(200).json(deletedPart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete part" });
  }
};
