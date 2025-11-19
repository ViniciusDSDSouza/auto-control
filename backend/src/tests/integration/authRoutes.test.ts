import "../setup/mocks";
import request from "supertest";
import { app } from "../../app";
import { mockPrisma as prisma } from "../setup/mocks";
import bcrypt from "bcrypt";
import { createMockUser } from "../helpers/factories";
import { generateToken } from "../../utils/jwt";

describe("POST /register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and create a new user", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    };
    const mockUser = createMockUser();

    (prisma.user.count as jest.Mock).mockResolvedValue(0);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).post("/register").send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Usuário registrado com sucesso",
    });

    expect(prisma.user.count).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: userData.name,
        email: userData.email,
        password: "hashed_password",
      },
    });
  });

  it("should return 500 when user already exists", async () => {
    (prisma.user.count as jest.Mock).mockResolvedValue(1);

    const response = await request(app).post("/register").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Não é possível criar mais usuários",
    });

    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it("should return 500 when name is missing", async () => {
    const response = await request(app).post("/register").send({
      email: "john@example.com",
      password: "123456",
    });

    expect(response.status).toBe(500);
  });

  it("should return 500 when email is missing", async () => {
    const response = await request(app).post("/register").send({
      name: "John Doe",
      password: "123456",
    });

    expect(response.status).toBe(500);
  });

  it("should return 500 when password is missing", async () => {
    const response = await request(app).post("/register").send({
      name: "John Doe",
      email: "john@example.com",
    });

    expect(response.status).toBe(500);
  });
});

describe("POST /login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and set cookie on successful login", async () => {
    const mockUser = createMockUser();
    const mockToken = "mock-jwt-token";
    const loginData = {
      email: mockUser.email,
      password: "123456",
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue(mockToken);

    const response = await request(app).post("/login").send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Login successful",
    });
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("token=" + mockToken);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginData.email },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password
    );
    expect(generateToken).toHaveBeenCalledWith(mockUser.id);
  });

  it("should return 500 when user does not exist", async () => {
    const loginData = {
      email: "nonexistent@example.com",
      password: "123456",
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app).post("/login").send(loginData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Failed to login user",
    });
    expect(response.headers["set-cookie"]).toBeUndefined();

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("should return 500 when password is incorrect", async () => {
    const mockUser = createMockUser();
    const loginData = {
      email: mockUser.email,
      password: "wrong_password",
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await request(app).post("/login").send(loginData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Failed to login user",
    });
    expect(response.headers["set-cookie"]).toBeUndefined();

    expect(bcrypt.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password
    );
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("should return 500 when email is missing", async () => {
    const response = await request(app).post("/login").send({
      password: "123456",
    });

    expect(response.status).toBe(500);
  });

  it("should return 500 when password is missing", async () => {
    const response = await request(app).post("/login").send({
      email: "john@example.com",
    });

    expect(response.status).toBe(500);
  });
});
