import "../setup/mocks";
import { mockPrisma as prisma } from "../setup/mocks";
import { loginUser, registerUser } from "../../services/authService";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";
import { createMockUser } from "../helpers/factories";

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a user when there are no users", async () => {
      const mockUser = createMockUser();
      const userData = {
        name: mockUser.name,
        email: mockUser.email,
        password: "123456",
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
      (prisma.user.count as jest.Mock).mockResolvedValue(0);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: "hashed_password",
      });

      const result = await registerUser(userData);

      expect(result).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
      expect(prisma.user.count).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: "hashed_password",
        },
      });
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when there are users", async () => {
      (prisma.user.count as jest.Mock).mockResolvedValue(1);

      await expect(
        registerUser({
          name: "John Doe",
          email: "john.doe@example.com",
          password: "123456",
        })
      ).rejects.toThrow("Não é possível criar mais usuários");

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("should login a user with valid credentials", async () => {
      const mockUser = createMockUser();
      const mockToken = "mock-jwt-token";
      const loginData = {
        email: mockUser.email,
        password: "123456",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = await loginUser(loginData);

      expect(result).toBe(mockToken);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password
      );
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(generateToken).toHaveBeenCalledWith(mockUser.id);
      expect(generateToken).toHaveBeenCalledTimes(1);
    });

    it("should throw error when user does not exist", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        loginUser({
          email: "nonexistent@example.com",
          password: "123456",
        })
      ).rejects.toThrow("Failed to login user");

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    it("should throw error when password is incorrect", async () => {
      const mockUser = createMockUser();
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        loginUser({
          email: mockUser.email,
          password: "wrong_password",
        })
      ).rejects.toThrow("Failed to login user");

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrong_password",
        mockUser.password
      );
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(generateToken).not.toHaveBeenCalled();
    });
  });
});
