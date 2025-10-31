import { useRegisterUserMutation } from "./api";
import { RegisterSchema } from "@/src/app/(authentication)/cadastro/schema";
import { registerFormToDto } from "./adapter";
import { useRouter } from "next/navigation";

export function useRegisterUser() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  async function handleRegisterUser(data: RegisterSchema) {
    try {
      const response = await registerUser(registerFormToDto(data));
      router.push("/login");
      return response;
    } catch (error) {
      throw error;
    }
  }

  return {
    handleRegisterUser,
    isLoading,
  };
}
