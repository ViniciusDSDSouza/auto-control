import {
  useLoginUserMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
} from "./api";
import { RegisterSchema } from "@/src/app/(authentication)/cadastro/schema";
import { loginFormToDto, registerFormToDto } from "./adapter";
import { useRouter } from "next/navigation";
import { toaster } from "@/src/components/ui/toaster";
import { LoginSchema } from "@/src/app/(authentication)/login/schema";

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
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Erro desconhecido ao registrar usuário";
      toaster.create({
        title: "Erro ao registrar usuário!",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });
    }
  }

  return {
    handleRegisterUser,
    isLoading,
  };
}

export function useLoginUser() {
  const [loginUser, { isLoading }] = useLoginUserMutation();

  async function handleLoginUser(data: LoginSchema) {
    try {
      const response = await loginUser(loginFormToDto(data)).unwrap();

      toaster.create({
        title: "Login realizado com sucesso!",
        description: "Você pode agora acessar o sistema!",
        type: "success",
        duration: 5000,
      });

      // Redireciona diretamente após login bem-sucedido
      window.location.href = "/notas";

      return response;
    } catch (error) {
      toaster.create({
        title: "Erro ao fazer login!",
        description: "Por favor, tente novamente!",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleLoginUser,
    isLoading,
  };
}

export function useLogoutUser() {
  const router = useRouter();
  const [logoutUser] = useLogoutUserMutation();

  async function handleLogoutUser() {
    try {
      await logoutUser().unwrap();

      toaster.create({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado com sucesso!",
        type: "success",
        duration: 3000,
      });

      router.push("/login");
    } catch (error) {
      // Mesmo com erro, redireciona para login
      router.push("/login");
    }
  }

  return {
    handleLogoutUser,
  };
}
