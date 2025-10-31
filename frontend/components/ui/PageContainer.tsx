"use client";

import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <Box
      suppressHydrationWarning
      minH="100vh"
      bgGradient="linear(to-br, orange.50, orange.100)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box w="100%" maxW="450px">
        {children}
      </Box>
    </Box>
  );
}
