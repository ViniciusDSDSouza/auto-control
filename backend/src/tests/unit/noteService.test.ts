import "../setup/mocks";
import { mockPrisma as prisma } from "../setup/mocks";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../../services/noteService";
import {
  createMockNote,
  createMockPartInNote,
  createMockCustomer,
  createMockCar,
} from "../helpers/factories";
import { NoteStatus } from "@prisma/client";

describe("NoteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllNotes", () => {
    it("should return paginated notes list", async () => {
      const mockNote = createMockNote();
      const totalItems = 1;

      (prisma.note.count as jest.Mock).mockResolvedValue(totalItems);
      (prisma.note.findMany as jest.Mock).mockResolvedValue([mockNote]);

      const result = await getAllNotes({ page: 1, itemsPerPage: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: mockNote.id,
        customerId: mockNote.customerId,
        carId: mockNote.carId,
        laborPrice: mockNote.laborPrice,
        partsPrice: mockNote.partsPrice,
        totalPrice: mockNote.totalPrice,
        status: mockNote.status,
      });
      expect(result.pagination).toMatchObject({
        page: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(prisma.note.count).toHaveBeenCalledTimes(1);
      expect(prisma.note.findMany).toHaveBeenCalledTimes(1);
    });

    it("should filter notes by customerId", async () => {
      const customerId = createMockCustomer().id;
      const mockNote = createMockNote({ customerId });
      (prisma.note.count as jest.Mock).mockResolvedValue(1);
      (prisma.note.findMany as jest.Mock).mockResolvedValue([mockNote]);

      const result = await getAllNotes({ customerId });

      expect(prisma.note.count).toHaveBeenCalledWith({
        where: { customerId },
      });
      expect(result.data[0].customerId).toBe(customerId);
    });

    it("should filter notes by status", async () => {
      const mockNote = createMockNote({ status: "PAID" as NoteStatus });
      (prisma.note.count as jest.Mock).mockResolvedValue(1);
      (prisma.note.findMany as jest.Mock).mockResolvedValue([mockNote]);

      const result = await getAllNotes({ status: "PAID" });

      expect(prisma.note.count).toHaveBeenCalledWith({
        where: { status: "PAID" },
      });
      expect(result.data[0].status).toBe("PAID");
    });
  });

  describe("getNoteById", () => {
    it("should return a note by id", async () => {
      const mockNote = createMockNote();
      (prisma.note.findUnique as jest.Mock).mockResolvedValue(mockNote);

      const result = await getNoteById(mockNote.id);

      expect(result).toEqual(mockNote);
      expect(prisma.note.findUnique).toHaveBeenCalledWith({
        where: { id: mockNote.id },
        include: {
          customer: true,
          car: true,
          parts: true,
        },
      });
    });

    it("should return null when note does not exist", async () => {
      (prisma.note.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getNoteById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("createNote", () => {
    it("should create a new note without parts", async () => {
      const noteData = {
        customerId: createMockCustomer().id,
        carId: createMockCar().id,
        laborPrice: 200.0,
        partsPrice: 0,
        totalPrice: 200.0,
        status: "OPEN" as NoteStatus,
      };
      const mockNote = createMockNote(noteData);
      (prisma.note.create as jest.Mock).mockResolvedValue(mockNote);

      const result = await createNote(noteData);

      expect(result).toEqual(mockNote);
      expect(prisma.note.create).toHaveBeenCalledWith({
        data: {
          customerId: noteData.customerId,
          carId: noteData.carId,
          laborPrice: noteData.laborPrice,
          partsPrice: noteData.partsPrice,
          totalPrice: noteData.totalPrice,
          status: noteData.status,
          parts: undefined,
        },
        include: {
          parts: true,
        },
      });
    });

    it("should create a new note with parts", async () => {
      const partInNote = createMockPartInNote();
      const noteData = {
        customerId: createMockCustomer().id,
        carId: createMockCar().id,
        laborPrice: 200.0,
        partsPrice: 100.0,
        totalPrice: 300.0,
        status: "OPEN" as NoteStatus,
        parts: [
          {
            partId: partInNote.partId,
            quantity: partInNote.quantity,
            price: partInNote.price,
          },
        ],
      };
      const mockNote = createMockNote({
        customerId: noteData.customerId,
        carId: noteData.carId,
        laborPrice: noteData.laborPrice,
        partsPrice: noteData.partsPrice,
        totalPrice: noteData.totalPrice,
        status: noteData.status,
        parts: [partInNote],
      });
      (prisma.note.create as jest.Mock).mockResolvedValue(mockNote);

      const result = await createNote(noteData);

      expect(result).toEqual(mockNote);
      expect(prisma.note.create).toHaveBeenCalledWith({
        data: {
          customerId: noteData.customerId,
          carId: noteData.carId,
          laborPrice: noteData.laborPrice,
          partsPrice: noteData.partsPrice,
          totalPrice: noteData.totalPrice,
          status: noteData.status,
          parts: {
            create: [
              {
                partId: noteData.parts![0].partId,
                quantity: noteData.parts![0].quantity,
                price: noteData.parts![0].price,
              },
            ],
          },
        },
        include: {
          parts: true,
        },
      });
    });
  });

  describe("updateNote", () => {
    it("should update an existing note", async () => {
      const noteId = createMockNote().id;
      const updateData = {
        customerId: createMockCustomer().id,
        carId: createMockCar().id,
        laborPrice: 250.0,
        partsPrice: 150.0,
        totalPrice: 400.0,
        status: "PAID" as NoteStatus,
      };
      const updatedNote = createMockNote({ id: noteId, ...updateData });
      (prisma.partInNote.deleteMany as jest.Mock).mockResolvedValue({
        count: 0,
      });
      (prisma.note.update as jest.Mock).mockResolvedValue(updatedNote);

      const result = await updateNote(noteId, updateData);

      expect(result).toEqual(updatedNote);
      expect(prisma.partInNote.deleteMany).toHaveBeenCalledWith({
        where: { noteId },
      });
      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: noteId },
        data: {
          customerId: updateData.customerId,
          carId: updateData.carId,
          laborPrice: updateData.laborPrice,
          partsPrice: updateData.partsPrice,
          totalPrice: updateData.totalPrice,
          status: updateData.status,
          parts: undefined,
        },
        include: { parts: true },
      });
    });
  });

  describe("deleteNote", () => {
    it("should delete a note successfully", async () => {
      const mockNote = createMockNote();
      (prisma.partInNote.deleteMany as jest.Mock).mockResolvedValue({
        count: 0,
      });
      (prisma.note.delete as jest.Mock).mockResolvedValue(mockNote);

      const result = await deleteNote(mockNote.id);

      expect(result).toEqual({ message: "Note deleted successfully" });
      expect(prisma.partInNote.deleteMany).toHaveBeenCalledWith({
        where: { noteId: mockNote.id },
      });
      expect(prisma.note.delete).toHaveBeenCalledWith({
        where: { id: mockNote.id },
      });
    });
  });
});
