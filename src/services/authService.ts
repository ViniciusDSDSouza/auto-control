import { prisma } from "../db/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import type { RegisterUserDto, LoginUserDto } from "../types/user";

export const registerUser = async ({
  email,
  password,
  name,
}: RegisterUserDto) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to register user");
  }
};

export const loginUser = async ({ email, password }: LoginUserDto) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken(user.id);
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to login user");
  }
};
