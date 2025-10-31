"use client";

import { Button, ButtonProps } from "@chakra-ui/react";

interface AuthButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function AuthButton({ children, ...props }: AuthButtonProps) {
  return (
    <Button
      type="submit"
      colorPalette="orange"
      variant="solid"
      size="lg"
      fontSize="md"
      fontWeight="semibold"
      borderRadius="lg"
      mt={2}
      w="100%"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "lg",
      }}
      transition="all 0.2s"
      {...props}
    >
      {children}
    </Button>
  );
}
