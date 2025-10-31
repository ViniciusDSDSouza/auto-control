"use client";

import { Input, Stack, Text, InputProps } from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends InputProps {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

export function FormInput({
  label,
  error,
  register,
  ...props
}: FormInputProps) {
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
        borderColor={error ? "red.500" : "gray.300"}
        _focus={{
          borderColor: error ? "red.500" : "orange.500",
          boxShadow: error
            ? "0 0 0 1px var(--chakra-colors-red-500)"
            : "0 0 0 1px var(--chakra-colors-orange-500)",
        }}
        {...props}
        {...register}
      />
      {error && (
        <Text fontSize="sm" color="red.500">
          {error}
        </Text>
      )}
    </Stack>
  );
}
