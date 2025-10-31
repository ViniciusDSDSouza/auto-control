import { RegisterSchema } from "@/src/app/(authentication)/cadastro/schema";
import { LoginUserDto, RegisterUserDto } from "./types";
import { LoginSchema } from "@/src/app/(authentication)/login/schema";

export function registerFormToDto(data: RegisterSchema): RegisterUserDto {
  return { name: data.name, email: data.email, password: data.password };
}

export function loginFormToDto(data: LoginSchema): LoginUserDto {
  return { email: data.email, password: data.password };
}
