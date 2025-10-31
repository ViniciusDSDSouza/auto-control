import { RegisterSchema } from "./schema";
import { useRegisterUser } from "@/src/modules/auth/hooks";

export function UserRegisterPage() {
  const { handleRegisterUser, isLoading } = useRegisterUser();

  function onSubmit(data: RegisterSchema) {
    handleRegisterUser(data);
  }

  return {
    onSubmit,
    isLoading,
  };
}
