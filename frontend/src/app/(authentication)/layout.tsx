"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckAuth } from "@/src/modules/auth/hooks";
import { Center, Spinner } from "@chakra-ui/react";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { authenticated, isLoading, isError } = useCheckAuth();

  useEffect(() => {
    if (!isLoading && !isError && authenticated) {
      router.push("/notas");
    }
  }, [router, authenticated, isLoading, isError]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  return <>{children}</>;
}
