"use client";

import {
  Input,
  Stack,
  Text,
  InputGroup,
  Box,
  Icon,
  InputProps,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps extends Omit<InputProps, "type"> {
  label?: string;
  placeholder?: string;
}

export function PasswordInput({
  label,
  placeholder = "Digite sua senha",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack gap={1}>
      {label && (
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          {label}
        </Text>
      )}
      <InputGroup
        endElement={
          <Box
            cursor="pointer"
            color="gray.500"
            _hover={{ color: "orange.500" }}
            onClick={() => setShowPassword(!showPassword)}
            display="flex"
            alignItems="center"
            pr={3}
            transition="color 0.2s"
          >
            <Icon as={showPassword ? FaEyeSlash : FaEye} boxSize={5} />
          </Box>
        }
      >
        <Input
          size="lg"
          borderRadius="lg"
          borderColor="gray.300"
          _focus={{
            borderColor: "orange.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-orange-500)",
          }}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...props}
        />
      </InputGroup>
    </Stack>
  );
}
