"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/sidebar/Sidebar";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { useCheckAuth } from "@/src/modules/auth/hooks";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { authenticated, isLoading, isError } = useCheckAuth();
  useEffect(() => {
    if (!isLoading && isError && !authenticated) {
      router.push("/login");
    }
  }, [router, authenticated, isLoading, isError]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <Sidebar />
      <Box
        ml={{ base: 0, lg: "260px" }}
        pt={{ base: 28, lg: 6 }}
        px={6}
        pb={6}
        minH="100vh"
        maxW="100vw"
        overflowX="hidden"
      >
        {children}
      </Box>
    </>
  );
}
