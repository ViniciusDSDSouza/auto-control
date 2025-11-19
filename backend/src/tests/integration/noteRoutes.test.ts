import "../setup/mocks";
import request from "supertest";
import { app } from "../../app";
import { mockPrisma as prisma } from "../setup/mocks";
import {
  createMockNote,
  createMockCustomer,
  createMockCar,
  createMockPartInNote,
} from "../helpers/factories";
import { NoteStatus } from "@prisma/client";

describe("GET /notes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and list all notes", async () => {
    const mockNotes = [createMockNote(), createMockNote()];

    (prisma.note.findMany as jest.Mock).mockResolvedValue(mockNotes);
    (prisma.note.count as jest.Mock).mockResolvedValue(2);

    const response = await request(app).get("/notes");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination.totalItems).toBe(2);
    expect(prisma.note.findMany).toHaveBeenCalledTimes(1);
  });

  it("should filter notes by customerId", async () => {
    const mockCustomer = createMockCustomer();
    const mockNotes = [createMockNote({ customerId: mockCustomer.id })];

    (prisma.note.findMany as jest.Mock).mockResolvedValue(mockNotes);
    (prisma.note.count as jest.Mock).mockResolvedValue(1);

    const response = await request(app)
      .get("/notes")
      .query({ customerId: mockCustomer.id });

    expect(response.status).toBe(200);
    expect(prisma.note.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          customerId: mockCustomer.id,
        }),
      })
    );
  });
});

describe("GET /notes/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and get note by id", async () => {
    const mockNote = createMockNote();

    (prisma.note.findUnique as jest.Mock).mockResolvedValue(mockNote);

    const response = await request(app).get(`/notes/${mockNote.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(mockNote.id);
    expect(prisma.note.findUnique).toHaveBeenCalled();
  });

  it("should return 500 when note not found", async () => {
    (prisma.note.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/notes/non-existent-id");

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
  });
});

describe("POST /notes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and create a new note", async () => {
    const mockCustomer = createMockCustomer();
    const mockCar = createMockCar({ customerId: mockCustomer.id });
    const mockPartInNote = createMockPartInNote();

    const noteData = {
      customerId: mockCustomer.id,
      carId: mockCar.id,
      laborPrice: 100,
      partsPrice: mockPartInNote.price * mockPartInNote.quantity,
      totalPrice: 100 + mockPartInNote.price * mockPartInNote.quantity,
      status: "PENDING" as NoteStatus,
      parts: [
        {
          partId: mockPartInNote.partId,
          quantity: mockPartInNote.quantity,
          price: mockPartInNote.price,
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
    });

    (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);
    (prisma.car.findUnique as jest.Mock).mockResolvedValue(mockCar);
    (prisma.note.create as jest.Mock).mockResolvedValue(mockNote);
    (prisma.partInNote.createMany as jest.Mock).mockResolvedValue({
      count: 1,
    });

    const response = await request(app).post("/notes").send(noteData);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(mockNote.id);
    expect(prisma.note.create).toHaveBeenCalled();
  });
});

describe("PUT /notes/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and update note", async () => {
    const mockNote = createMockNote();
    const updateData = {
      status: "COMPLETED" as NoteStatus,
    };

    (prisma.note.update as jest.Mock).mockResolvedValue({
      ...mockNote,
      ...updateData,
    });

    const response = await request(app)
      .put(`/notes/${mockNote.id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(prisma.note.update).toHaveBeenCalled();
  });
});

describe("DELETE /notes/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and delete note", async () => {
    const mockNote = createMockNote();

    (prisma.partInNote.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
    (prisma.note.delete as jest.Mock).mockResolvedValue(mockNote);

    const response = await request(app).delete(`/notes/${mockNote.id}`);

    expect(response.status).toBe(200);
    expect(prisma.note.delete).toHaveBeenCalledWith({
      where: { id: mockNote.id },
    });
  });
});
