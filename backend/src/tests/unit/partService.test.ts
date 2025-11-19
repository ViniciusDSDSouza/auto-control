import "../setup/mocks";
import { mockPrisma as prisma } from "../setup/mocks";
import {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
} from "../../services/partService";
import { createMockPart } from "../helpers/factories";

describe("PartService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllParts", () => {
    it("should return paginated parts list", async () => {
      const mockPart = createMockPart();
      const totalItems = 1;

      (prisma.part.count as jest.Mock).mockResolvedValue(totalItems);
      (prisma.part.findMany as jest.Mock).mockResolvedValue([mockPart]);

      const result = await getAllParts({ page: 1, itemsPerPage: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: mockPart.id,
        name: mockPart.name,
        model: mockPart.model,
        price: mockPart.price,
      });
      expect(result.pagination).toMatchObject({
        page: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(prisma.part.count).toHaveBeenCalledTimes(1);
      expect(prisma.part.findMany).toHaveBeenCalledTimes(1);
    });

    it("should filter parts by name", async () => {
      const mockPart = createMockPart({ name: "Filtro de Óleo" });
      (prisma.part.count as jest.Mock).mockResolvedValue(1);
      (prisma.part.findMany as jest.Mock).mockResolvedValue([mockPart]);

      const result = await getAllParts({ name: "Filtro" });

      expect(prisma.part.count).toHaveBeenCalledWith({
        where: {
          name: {
            contains: "Filtro",
            mode: "insensitive",
          },
        },
      });
      expect(result.data[0].name).toBe("Filtro de Óleo");
    });

    it("should handle pagination correctly", async () => {
      const mockParts = [createMockPart(), createMockPart()];
      (prisma.part.count as jest.Mock).mockResolvedValue(20);
      (prisma.part.findMany as jest.Mock).mockResolvedValue(mockParts);

      const result = await getAllParts({ page: 2, itemsPerPage: 10 });

      expect(result.pagination).toMatchObject({
        page: 2,
        itemsPerPage: 10,
        totalItems: 20,
        totalPages: 2,
        hasNext: false,
        hasPrev: true,
      });
      expect(prisma.part.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );
    });
  });

  describe("getPartById", () => {
    it("should return a part by id", async () => {
      const mockPart = createMockPart();
      (prisma.part.findUnique as jest.Mock).mockResolvedValue(mockPart);

      const result = await getPartById(mockPart.id);

      expect(result).toEqual(mockPart);
      expect(prisma.part.findUnique).toHaveBeenCalledWith({
        where: { id: mockPart.id },
      });
    });

    it("should return null when part does not exist", async () => {
      (prisma.part.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getPartById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("createPart", () => {
    it("should create a new part", async () => {
      const partData = {
        name: "Filtro de Ar",
        model: "FA-456",
        price: 35.99,
      };
      const mockPart = createMockPart(partData);
      (prisma.part.create as jest.Mock).mockResolvedValue(mockPart);

      const result = await createPart(partData);

      expect(result).toEqual(mockPart);
      expect(prisma.part.create).toHaveBeenCalledWith({
        data: partData,
      });
    });
  });

  describe("updatePart", () => {
    it("should update an existing part", async () => {
      const partId = createMockPart().id;
      const updateData = {
        name: "Filtro de Ar Atualizado",
        model: "FA-789",
        price: 45.99,
      };
      const updatedPart = createMockPart({ id: partId, ...updateData });
      (prisma.part.update as jest.Mock).mockResolvedValue(updatedPart);

      const result = await updatePart(partId, updateData);

      expect(result).toEqual(updatedPart);
      expect(prisma.part.update).toHaveBeenCalledWith({
        where: { id: partId },
        data: updateData,
      });
    });
  });

  describe("deletePart", () => {
    it("should delete a part successfully", async () => {
      const mockPart = createMockPart();
      (prisma.part.delete as jest.Mock).mockResolvedValue(mockPart);

      const result = await deletePart(mockPart.id);

      expect(result).toEqual({ message: "Part deleted successfully" });
      expect(prisma.part.delete).toHaveBeenCalledWith({
        where: { id: mockPart.id },
      });
    });
  });
});
