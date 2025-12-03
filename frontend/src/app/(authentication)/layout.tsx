"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckAuthQuery } from "@/src/modules/auth/api";
import { Center, Spinner } from "@chakra-ui/react";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!isLoading && data?.authenticated) {
      router.push("/notas");
    }
  }, [router, data?.authenticated, isLoading]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  return <>{children}</>;
}
