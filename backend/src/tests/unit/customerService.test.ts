import "../setup/mocks";
import { mockPrisma as prisma } from "../setup/mocks";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customerService";
import {
  createMockCustomer,
  createMockCar,
  createMockNote,
} from "../helpers/factories";

describe("CustomerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCustomers", () => {
    it("should return paginated customers list", async () => {
      const mockCustomer = createMockCustomer();
      const totalItems = 1;

      (prisma.customer.count as jest.Mock).mockResolvedValue(totalItems);
      (prisma.customer.findMany as jest.Mock).mockResolvedValue([mockCustomer]);

      const result = await getAllCustomers({ page: 1, itemsPerPage: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: mockCustomer.id,
        name: mockCustomer.name,
        email: mockCustomer.email,
        phone: mockCustomer.phone,
      });
      expect(result.pagination).toMatchObject({
        page: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(prisma.customer.count).toHaveBeenCalledTimes(1);
      expect(prisma.customer.findMany).toHaveBeenCalledTimes(1);
    });

    it("should filter customers by name", async () => {
      const mockCustomer = createMockCustomer({ name: "John Doe" });
      (prisma.customer.count as jest.Mock).mockResolvedValue(1);
      (prisma.customer.findMany as jest.Mock).mockResolvedValue([mockCustomer]);

      const result = await getAllCustomers({ name: "John" });

      expect(prisma.customer.count).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              name: {
                contains: "John",
                mode: "insensitive",
              },
            },
          ],
        },
      });
      expect(result.data[0].name).toBe("John Doe");
    });

    it("should filter customers by phone", async () => {
      const mockCustomer = createMockCustomer({ phone: "(11) 98765-4321" });
      (prisma.customer.count as jest.Mock).mockResolvedValue(1);
      (prisma.customer.findMany as jest.Mock).mockResolvedValue([mockCustomer]);

      const result = await getAllCustomers({ phone: "98765" });

      expect(prisma.customer.count).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              phone: {
                contains: "98765",
                mode: "insensitive",
              },
            },
          ],
        },
      });
      expect(result.data[0].phone).toBe("(11) 98765-4321");
    });
  });

  describe("getCustomerById", () => {
    it("should return a customer by id", async () => {
      const mockCustomer = createMockCustomer();
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await getCustomerById(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id: mockCustomer.id },
        include: {
          cars: true,
          notes: {
            include: {
              car: true,
            },
          },
        },
      });
    });

    it("should throw error when customer does not exist", async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getCustomerById("non-existent-id")).rejects.toThrow(
        "Failed to get customer"
      );
    });
  });

  describe("createCustomer", () => {
    it("should create a new customer", async () => {
      const customerData = {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "(11) 99999-9999",
      };
      const mockCustomer = createMockCustomer(customerData);
      (prisma.customer.create as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await createCustomer(customerData);

      expect(result).toEqual(mockCustomer);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: {
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email,
          cars: undefined,
          notes: undefined,
        },
      });
    });
  });

  describe("updateCustomer", () => {
    it("should update an existing customer", async () => {
      const customerId = createMockCustomer().id;
      const updateData = {
        name: "Jane Doe Updated",
        email: "jane.updated@example.com",
        phone: "(11) 88888-8888",
      };
      const updatedCustomer = createMockCustomer({
        id: customerId,
        ...updateData,
      });
      (prisma.customer.update as jest.Mock).mockResolvedValue(updatedCustomer);

      const result = await updateCustomer(customerId, updateData);

      expect(result).toEqual(updatedCustomer);
      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: { id: customerId },
        data: {
          name: updateData.name,
          phone: updateData.phone,
          email: updateData.email,
          cars: undefined,
          notes: undefined,
        },
        include: {
          cars: true,
          notes: true,
        },
      });
    });
  });

  describe("deleteCustomer", () => {
    it("should delete a customer without cars and notes", async () => {
      const mockCustomer = createMockCustomer({
        cars: [],
        notes: [],
      });
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);
      (prisma.customer.delete as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await deleteCustomer(mockCustomer.id);

      expect(result).toEqual({ message: "Customer deleted successfully" });
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id: mockCustomer.id },
        include: {
          cars: true,
          notes: true,
        },
      });
      expect(prisma.customer.delete).toHaveBeenCalledWith({
        where: { id: mockCustomer.id },
      });
    });

    it("should throw error when customer has cars", async () => {
      const mockCar = createMockCar();
      const mockCustomer = createMockCustomer({
        cars: [mockCar],
        notes: [],
      });
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);

      await expect(deleteCustomer(mockCustomer.id)).rejects.toThrow(
        "Não é possível excluir"
      );
      expect(prisma.customer.delete).not.toHaveBeenCalled();
    });

    it("should throw error when customer has notes", async () => {
      const mockNote = createMockNote();
      const mockCustomer = createMockCustomer({
        cars: [],
        notes: [mockNote],
      });
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(mockCustomer);

      await expect(deleteCustomer(mockCustomer.id)).rejects.toThrow(
        "Não é possível excluir"
      );
      expect(prisma.customer.delete).not.toHaveBeenCalled();
    });

    it("should throw error when customer does not exist", async () => {
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(deleteCustomer("non-existent-id")).rejects.toThrow(
        "Customer not found"
      );
      expect(prisma.customer.delete).not.toHaveBeenCalled();
    });
  });
});
