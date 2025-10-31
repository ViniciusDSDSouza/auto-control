import { useLoginUser } from "@/src/modules/auth/hooks";
import { LoginSchema } from "./schema";

export function useLoginPage() {
  const { handleLoginUser, isLoading } = useLoginUser();

  function onSubmit(data: LoginSchema) {
    handleLoginUser(data);
  }

  return {
    onSubmit,
    isLoading,
  };
}
