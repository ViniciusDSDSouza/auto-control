import "../setup/mocks";
import request from "supertest";
import { app } from "../../app";
import { mockPrisma as prisma } from "../setup/mocks";
import { createMockCustomer } from "../helpers/factories";

describe("GET /customers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and list all customers", async () => {
    const mockCustomers = [createMockCustomer(), createMockCustomer()];

    (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);
    (prisma.customer.count as jest.Mock).mockResolvedValue(2);

    const response = await request(app).get("/customers");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination.totalItems).toBe(2);
    expect(prisma.customer.findMany).toHaveBeenCalledTimes(1);
  });

  it("should filter customers by name", async () => {
    const mockCustomers = [createMockCustomer({ name: "John Doe" })];

    (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);
    (prisma.customer.count as jest.Mock).mockResolvedValue(1);

    const response = await request(app)
      .get("/customers")
      .query({ name: "John" });

    expect(response.status).toBe(200);
    expect(prisma.customer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                contains: "John",
              }),
            }),
          ]),
        }),
      })
    );
  });
});

describe("GET /customers/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and get customer by id", async () => {
    const mockCustomer = createMockCustomer();

    (prisma.customer.findUnique as jest.Mock).mockResolvedValue({
      ...mockCustomer,
      cars: [],
      notes: [],
    });

    const response = await request(app).get(`/customers/${mockCustomer.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(mockCustomer.id);
    expect(prisma.customer.findUnique).toHaveBeenCalled();
  });

  it("should return 500 when customer not found", async () => {
    (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get("/customers/non-existent-id");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to get customer");
  });
});

describe("POST /customers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and create a new customer", async () => {
    const customerData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
    };
    const mockCustomer = createMockCustomer(customerData);

    (prisma.customer.create as jest.Mock).mockResolvedValue(mockCustomer);

    const response = await request(app).post("/customers").send(customerData);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(mockCustomer.id);
    expect(prisma.customer.create).toHaveBeenCalledWith({
      data: customerData,
    });
  });
});

describe("PUT /customers/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and update customer", async () => {
    const mockCustomer = createMockCustomer();
    const updateData = {
      name: "Updated Name",
      email: "updated@example.com",
    };

    (prisma.customer.update as jest.Mock).mockResolvedValue({
      ...mockCustomer,
      ...updateData,
      cars: [],
      notes: [],
    });

    const response = await request(app)
      .put(`/customers/${mockCustomer.id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(prisma.customer.update).toHaveBeenCalledWith({
      where: { id: mockCustomer.id },
      data: expect.objectContaining({
        name: updateData.name,
        email: updateData.email,
      }),
      include: {
        cars: true,
        notes: true,
      },
    });
  });
});

describe("DELETE /customers/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and delete customer", async () => {
    const mockCustomer = createMockCustomer();

    (prisma.customer.findUnique as jest.Mock).mockResolvedValue({
      ...mockCustomer,
      cars: [],
      notes: [],
    });
    (prisma.customer.delete as jest.Mock).mockResolvedValue(mockCustomer);

    const response = await request(app).delete(`/customers/${mockCustomer.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Customer deleted successfully");
    expect(prisma.customer.delete).toHaveBeenCalledWith({
      where: { id: mockCustomer.id },
    });
  });
});
