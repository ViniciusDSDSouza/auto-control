import { RegisterSchema } from "@/src/app/(authentication)/cadastro/schema";
import { RegisterUserDto } from "./types";

export function registerFormToDto(data: RegisterSchema): RegisterUserDto {
  return { name: data.name, email: data.email, password: data.password };
}
