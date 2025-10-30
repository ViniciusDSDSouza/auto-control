import { Request, Response } from "express";
import { NoteStatus } from "@prisma/client";

export const getEnumNoteStatusController = async (
  _req: Request,
  res: Response
) => {
  try {
    const enumNoteStatus = NoteStatus;
    res.status(200).json(enumNoteStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get enum note status" });
  }
};
