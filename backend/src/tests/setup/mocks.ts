import type { AuthRequest } from "../../middlewares/authMiddleware";

export const mockPrisma = {
  user: {
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  customer: {
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  car: {
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  part: {
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  note: {
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  partInNote: {
    count: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
};

jest.mock("../../db/client", () => ({
  prisma: mockPrisma,
}));

jest.mock("bcrypt");

jest.mock("../../utils/jwt", () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
}));

jest.mock("express-rate-limit", () => {
  const mockMiddleware = jest.fn((_req, _res, next) => next());
  return {
    rateLimit: jest.fn(() => mockMiddleware),
  };
});

jest.mock("../../middlewares/authMiddleware", () => {
  const mockUser = { id: "mock-user-id" };
  return {
    authMiddleware: jest.fn((req, _res, next) => {
      (req as AuthRequest).user = mockUser;
      next();
    }),
  };
});
