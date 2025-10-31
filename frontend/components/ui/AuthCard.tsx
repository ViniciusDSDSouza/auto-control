"use client";

import { Card } from "@chakra-ui/react";
import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card.Root
      size="lg"
      shadow="xl"
      borderRadius="2xl"
      borderWidth="0"
      bg="white"
    >
      {children}
    </Card.Root>
  );
}
