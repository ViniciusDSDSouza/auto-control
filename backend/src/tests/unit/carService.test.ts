import "../setup/mocks";
import { mockPrisma as prisma } from "../setup/mocks";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../../services/carService";
import {
  createMockCar,
  createMockCustomer,
  createMockNote,
} from "../helpers/factories";

describe("CarService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCars", () => {
    it("should return paginated cars list", async () => {
      const mockCar = createMockCar();
      const totalItems = 1;

      (prisma.car.count as jest.Mock).mockResolvedValue(totalItems);
      (prisma.car.findMany as jest.Mock).mockResolvedValue([mockCar]);

      const result = await getAllCars({ page: 1, itemsPerPage: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: mockCar.id,
        customerId: mockCar.customerId,
        brand: mockCar.brand,
        model: mockCar.model,
        plate: mockCar.plate,
        year: mockCar.year,
        color: mockCar.color,
      });
      expect(result.pagination).toMatchObject({
        page: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(prisma.car.count).toHaveBeenCalledTimes(1);
      expect(prisma.car.findMany).toHaveBeenCalledTimes(1);
    });

    it("should filter cars by brand", async () => {
      const mockCar = createMockCar({ brand: "Ford" });
      (prisma.car.count as jest.Mock).mockResolvedValue(1);
      (prisma.car.findMany as jest.Mock).mockResolvedValue([mockCar]);

      const result = await getAllCars({ brand: "Ford" });

      expect(prisma.car.count).toHaveBeenCalledWith({
        where: {
          brand: {
            contains: "Ford",
            mode: "insensitive",
          },
        },
      });
      expect(result.data[0].brand).toBe("Ford");
    });

    it("should filter cars by customerId", async () => {
      const customerId = createMockCustomer().id;
      const mockCar = createMockCar({ customerId });
      (prisma.car.count as jest.Mock).mockResolvedValue(1);
      (prisma.car.findMany as jest.Mock).mockResolvedValue([mockCar]);

      const result = await getAllCars({ customerId });

      expect(prisma.car.count).toHaveBeenCalledWith({
        where: { customerId },
      });
      expect(result.data[0].customerId).toBe(customerId);
    });
  });

  describe("getCarById", () => {
    it("should return a car by id", async () => {
      const mockCar = createMockCar();
      (prisma.car.findUnique as jest.Mock).mockResolvedValue(mockCar);

      const result = await getCarById(mockCar.id);

      expect(result).toEqual(mockCar);
      expect(prisma.car.findUnique).toHaveBeenCalledWith({
        where: { id: mockCar.id },
        include: { notes: true },
      });
    });

    it("should return null when car does not exist", async () => {
      (prisma.car.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getCarById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("createCar", () => {
    it("should create a new car", async () => {
      const carData = {
        customerId: createMockCustomer().id,
        brand: "Ford",
        model: "F150",
        plate: "ABC-1234",
        year: 2020,
        color: "Red",
      };
      const mockCar = createMockCar(carData);
      (prisma.car.create as jest.Mock).mockResolvedValue(mockCar);

      const result = await createCar(carData);

      expect(result).toEqual(mockCar);
      expect(prisma.car.create).toHaveBeenCalledWith({
        data: carData,
      });
    });
  });

  describe("updateCar", () => {
    it("should update an existing car", async () => {
      const carId = createMockCar().id;
      const updateData = {
        customerId: createMockCustomer().id,
        brand: "Chevrolet",
        model: "Silverado",
        plate: "XYZ-5678",
        year: 2021,
        color: "Blue",
      };
      const updatedCar = createMockCar({ id: carId, ...updateData });
      (prisma.car.update as jest.Mock).mockResolvedValue(updatedCar);

      const result = await updateCar(carId, updateData);

      expect(result).toEqual(updatedCar);
      expect(prisma.car.update).toHaveBeenCalledWith({
        where: { id: carId },
        data: updateData,
      });
    });
  });

  describe("deleteCar", () => {
    it("should delete a car without notes", async () => {
      const mockCar = createMockCar({ notes: [] });
      (prisma.car.findUnique as jest.Mock).mockResolvedValue(mockCar);
      (prisma.car.delete as jest.Mock).mockResolvedValue(mockCar);

      const result = await deleteCar(mockCar.id);

      expect(result).toEqual({ message: "Car deleted successfully" });
      expect(prisma.car.findUnique).toHaveBeenCalledWith({
        where: { id: mockCar.id },
        include: { notes: true },
      });
      expect(prisma.car.delete).toHaveBeenCalledWith({
        where: { id: mockCar.id },
      });
    });

    it("should throw error when car has notes", async () => {
      const mockNote1 = createMockNote();
      const mockNote2 = createMockNote();
      const mockCar = createMockCar({
        notes: [mockNote1, mockNote2],
      });
      (prisma.car.findUnique as jest.Mock).mockResolvedValue(mockCar);

      await expect(deleteCar(mockCar.id)).rejects.toThrow(
        "Não é possível excluir"
      );
      expect(prisma.car.delete).not.toHaveBeenCalled();
    });

    it("should throw error when car does not exist", async () => {
      (prisma.car.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(deleteCar("non-existent-id")).rejects.toThrow(
        "Car not found"
      );
      expect(prisma.car.delete).not.toHaveBeenCalled();
    });
  });
});
