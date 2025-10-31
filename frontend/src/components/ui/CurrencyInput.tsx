"use client";

import { Input, InputProps, Stack, Text } from "@chakra-ui/react";
import { useRef, useEffect, useCallback } from "react";

interface CurrencyInputProps extends Omit<InputProps, "value" | "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  error?: string;
  label?: string;
}

const applyCurrencyMask = (value: string): string => {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  const numericValue = parseInt(numbers, 10) / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const removeCurrencyMask = (value: string): number => {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return 0;
  return parseInt(numbers, 10) / 100;
};

export function CurrencyInput({
  value = 0,
  onChange,
  error,
  label,
  ...props
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previousValueRef = useRef(value);
  const isInternalChangeRef = useRef(false);

  const formatCurrency = useCallback((num: number): string => {
    if (num <= 0) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }, []);

  useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      previousValueRef.current = value;
      return;
    }

    if (previousValueRef.current === value || !inputRef.current) return;

    previousValueRef.current = value;
    const formatted = formatCurrency(value);
    const currentValue = inputRef.current.value || "";

    if (formatted !== currentValue) {
      inputRef.current.value = formatted;
    }
  }, [value, formatCurrency]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;

    const inputValue = e.target.value;

    if (!inputValue || inputValue.trim() === "R$") {
      inputRef.current.value = "";
      isInternalChangeRef.current = true;
      if (onChange) onChange(0);
      return;
    }

    const maskedValue = applyCurrencyMask(inputValue);
    inputRef.current.value = maskedValue;

    const numericValue = removeCurrencyMask(maskedValue);
    isInternalChangeRef.current = true;
    if (onChange) {
      onChange(numericValue);
    }
  };

  const handleBlur = () => {
    if (!inputRef.current) return;

    const currentValue = inputRef.current.value || "";
    const numericValue = removeCurrencyMask(currentValue);

    if (numericValue > 0) {
      const formatted = formatCurrency(numericValue);
      inputRef.current.value = formatted;
      if (onChange && Math.abs(numericValue - value) > 0.01) {
        onChange(numericValue);
      }
    } else {
      inputRef.current.value = "";
      if (onChange && value !== 0) {
        onChange(0);
      }
    }
  };

  useEffect(() => {
    if (inputRef.current && value > 0 && !inputRef.current.value) {
      inputRef.current.value = formatCurrency(value);
    }
  }, [value, formatCurrency]);

  const inputElement = (
    <Input
      ref={inputRef}
      onInput={handleInput}
      onBlur={handleBlur}
      borderRadius="lg"
      borderColor={error ? "red.500" : "gray.300"}
      _focus={{
        borderColor: error ? "red.500" : "orange.500",
        boxShadow: error
          ? "0 0 0 1px var(--chakra-colors-red-500)"
          : "0 0 0 1px var(--chakra-colors-orange-500)",
      }}
      placeholder="R$ 0,00"
      inputMode="decimal"
      defaultValue={value > 0 ? formatCurrency(value) : ""}
      {...props}
    />
  );

  if (!label && !error) {
    return inputElement;
  }

  return (
    <Stack gap={1}>
      {label && (
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          {label}
        </Text>
      )}
      {inputElement}
      {error && (
        <Text fontSize="sm" color="red.500">
          {error}
        </Text>
      )}
    </Stack>
  );
}
