"use client";

import { Sidebar } from "@/src/components/sidebar/Sidebar";
import { Box } from "@chakra-ui/react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // A autenticação é verificada automaticamente pelo baseQuery
  // Se qualquer request retornar 401, o usuário será redirecionado para /login

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
