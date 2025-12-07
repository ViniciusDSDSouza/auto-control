"use client";

import { Sidebar } from "@/src/components/sidebar/Sidebar";
import { Box } from "@chakra-ui/react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Autenticação é tratada pelo baseQuery
  // Qualquer request 401 redireciona para /login

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
