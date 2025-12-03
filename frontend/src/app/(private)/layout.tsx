"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/sidebar/Sidebar";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { useCheckAuthQuery } from "@/src/modules/auth/api";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!isLoading && (isError || !data?.authenticated)) {
      router.push("/login");
    }
  }, [router, data?.authenticated, isLoading, isError]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  if (isError || !data?.authenticated) {
    return null;
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
