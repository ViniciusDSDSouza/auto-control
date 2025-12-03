import {
  useCheckAuthQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
  authApi,
} from "./api";
import { RegisterSchema } from "@/src/app/(authentication)/cadastro/schema";
import { loginFormToDto, registerFormToDto } from "./adapter";
import { useRouter } from "next/navigation";
import { toaster } from "@/src/components/ui/toaster";
import { LoginSchema } from "@/src/app/(authentication)/login/schema";
import { useDispatch } from "react-redux";

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
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const { refetch: refetchCheckAuth } = useCheckAuthQuery(undefined, {
    skip: true, // Não executa automaticamente
  });

  async function handleLoginUser(data: LoginSchema) {
    try {
      const response = await loginUser(loginFormToDto(data)).unwrap();

      // Aguardar mais tempo para garantir que o cookie foi processado (mobile pode ser mais lento)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Invalidar cache manualmente
      dispatch(authApi.util.invalidateTags(["Auth"]));

      // Fazer um checkAuth manual para garantir que o cookie está funcionando
      let authVerified = false;
      let retries = 0;
      const maxRetries = 3;

      while (!authVerified && retries < maxRetries) {
        try {
          const authCheck = await refetchCheckAuth();
          if (authCheck.data?.authenticated) {
            authVerified = true;
            break;
          }
        } catch (authError) {
          console.error(`Tentativa ${retries + 1} de verificação de auth falhou:`, authError);
        }
        
        if (!authVerified && retries < maxRetries - 1) {
          // Aguardar um pouco antes de tentar novamente
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        retries++;
      }

      if (!authVerified) {
        throw new Error("Não foi possível verificar a autenticação após o login");
      }

      toaster.create({
        title: "Login realizado com sucesso!",
        description: "Você pode agora acessar o sistema!",
        type: "success",
        duration: 5000,
      });

      // Forçar refresh completo
      router.refresh();
      
      // Pequeno delay antes de redirecionar
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      // Usar window.location para garantir navegação completa no mobile
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

      await new Promise((resolve) => setTimeout(resolve, 100));

      toaster.create({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado com sucesso!",
        type: "success",
        duration: 3000,
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      router.push("/login");
      router.refresh();
    }
  }

  return {
    handleLogoutUser,
  };
}

export function useCheckAuth() {
  const { data, isLoading, isError } = useCheckAuthQuery();

  return {
    authenticated: data?.authenticated || false,
    isLoading,
    isError,
  };
}
