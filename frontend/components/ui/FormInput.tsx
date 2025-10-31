"use client";

import { Input, Stack, Text, InputProps } from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends InputProps {
  label?: string;
  register?: UseFormRegisterReturn;
}

export function FormInput({ label, register, ...props }: FormInputProps) {
  return (
    <Stack gap={1}>
      {label && (
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          {label}
        </Text>
      )}
      <Input
        size="lg"
        borderRadius="lg"
        borderColor="gray.300"
        _focus={{
          borderColor: "orange.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-orange-500)",
        }}
        {...props}
        {...register}
      />
    </Stack>
  );
}
