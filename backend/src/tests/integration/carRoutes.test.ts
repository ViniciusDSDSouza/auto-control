import "../setup/mocks";
import request from "supertest";
import { app } from "../../app";
import { mockPrisma as prisma } from "../setup/mocks";
import { createMockCar, createMockCustomer } from "../helpers/factories";

describe("GET /cars", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and list all cars", async () => {
    const mockCars = [createMockCar(), createMockCar()];

    (prisma.car.findMany as jest.Mock).mockResolvedValue(mockCars);
    (prisma.car.count as jest.Mock).mockResolvedValue(2);

    const response = await request(app).get("/cars");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination.totalItems).toBe(2);
    expect(prisma.car.findMany).toHaveBeenCalledTimes(1);
  });

  it("should filter cars by brand", async () => {
    const mockCars = [createMockCar({ brand: "Toyota" })];

    (prisma.car.findMany as jest.Mock).mockResolvedValue(mockCars);
    (prisma.car.count as jest.Mock).mockResolvedValue(1);

    const response = await request(app).get("/cars").query({ brand: "Toyota" });

    expect(response.status).toBe(200);
    expect(prisma.car.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          brand: expect.objectContaining({
            contains: "Toyota",
          }),
        }),
      })
    );
  });
});

describe("GET /cars/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and get car by id", async () => {
    const mockCar = createMockCar();

    (prisma.car.findUnique as jest.Mock).mockResolvedValue(mockCar);

    const response = await request(app).get(`/cars/${mockCar.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(mockCar.id);
    expect(prisma.car.findUnique).toHaveBeenCalled();
  });

  it("should return 404 when car not found", async () => {
    (prisma.car.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/cars/non-existent-id");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Car not found");
  });
});

describe("POST /cars", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and create a new car", async () => {
    const mockCustomer = createMockCustomer();
    const carData = {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      plate: "ABC1234",
      color: "Blue",
      customerId: mockCustomer.id,
    };
    const mockCar = createMockCar(carData);

    (prisma.car.create as jest.Mock).mockResolvedValue(mockCar);

    const response = await request(app).post("/cars").send(carData);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(mockCar.id);
    expect(prisma.car.create).toHaveBeenCalled();
  });
});

describe("PUT /cars/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and update car", async () => {
    const mockCar = createMockCar();
    const updateData = {
      brand: "Honda",
      model: "Civic",
      color: "Red",
    };

    (prisma.car.update as jest.Mock).mockResolvedValue({
      ...mockCar,
      ...updateData,
    });

    const response = await request(app)
      .put(`/cars/${mockCar.id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(prisma.car.update).toHaveBeenCalled();
  });
});

describe("DELETE /cars/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and delete car", async () => {
    const mockCar = createMockCar();

    (prisma.car.findUnique as jest.Mock).mockResolvedValue({
      ...mockCar,
      notes: [],
    });
    (prisma.car.delete as jest.Mock).mockResolvedValue(mockCar);

    const response = await request(app).delete(`/cars/${mockCar.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Car deleted successfully");
    expect(prisma.car.delete).toHaveBeenCalledWith({
      where: { id: mockCar.id },
    });
  });
});
