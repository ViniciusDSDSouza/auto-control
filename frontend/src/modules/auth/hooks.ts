import { useRegisterUserMutation } from "./api";
import { RegisterSchema } from "@/src/app/(authentication)/cadastro/schema";
import { registerFormToDto } from "./adapter";
import { useRouter } from "next/navigation";
import { toaster } from "@/src/components/ui/toaster";

export function useRegisterUser() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  async function handleRegisterUser(data: RegisterSchema) {
    try {
      const response = await registerUser(registerFormToDto(data)).unwrap();

      toaster.create({
        title: "Usuário registrado com sucesso!",
        description: "Você pode agora fazer login com suas credenciais!",
        type: "success",
        duration: 5000,
      });

      router.push("/login");
      return response;
    } catch (error) {
      toaster.create({
        title: "Erro ao registrar usuário!",
        description: "Por favor, tente novamente!",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleRegisterUser,
    isLoading,
  };
}
