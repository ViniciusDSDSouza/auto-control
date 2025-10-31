"use client";

import { Card } from "@chakra-ui/react";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <Card.Header textAlign="center" pb={6}>
      <Card.Title fontSize="3xl" fontWeight="bold" color="orange.600" mb={2}>
        {title}
      </Card.Title>
      <Card.Description color="gray.600" fontSize="md">
        {description}
      </Card.Description>
    </Card.Header>
  );
}
