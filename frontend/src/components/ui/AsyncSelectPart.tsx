"use client";

import { AsyncPaginate } from "react-select-async-paginate";
import { GroupBase, OptionsOrGroups } from "react-select";
import { useMemo, useEffect, useCallback, useRef } from "react";
import { useGetPartByIdQuery } from "@/src/modules/part/api";
import type { Part } from "@/src/modules/part/types";

interface SelectOption {
  value: string;
  label: string;
  price: number;
}

interface AsyncSelectPartProps {
  value?: string;
  onChange: (value: string, price: number) => void;
  error?: string;
  placeholder?: string;
}

export function AsyncSelectPart({
  value,
  onChange,
  error,
  placeholder = "Selecione uma peça",
}: AsyncSelectPartProps) {
  const { data: partData } = useGetPartByIdQuery(value || "", {
    skip: !value,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedPart = useMemo<SelectOption | null>(() => {
    if (partData && value && partData.id === value) {
      return {
        value: partData.id,
        label: `${partData.name} ${partData.model}`,
        price: partData.price,
      };
    }
    return null;
  }, [partData, value]);

  const fetchParts = useCallback(
    async (
      searchQuery: string,
      _: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
      additional?: { page: number }
    ) => {
      const page = additional?.page || 1;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!baseUrl) {
        throw new Error("URL da API não configurada");
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        itemsPerPage: "4",
        orderBy: "name",
        orderDirection: "asc",
      });

      if (searchQuery) {
        queryParams.append("name", searchQuery);
      }

      const response = await fetch(`${baseUrl}/parts?${queryParams}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar peças");
      }

      const data = await response.json();
      const parts: Part[] = data.data || [];
      const pagination = data.pagination;

      const options: SelectOption[] = parts.map((part) => ({
        value: part.id,
        label: `${part.name} ${part.model}`,
        price: part.price,
      }));

      return {
        options,
        hasMore: pagination?.hasNext || false,
        additional: {
          page: page + 1,
        },
      };
    },
    []
  );

  const loadOptions = useCallback(
    async (
      searchQuery: string,
      _: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
      additional?: { page: number }
    ) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      return new Promise<{
        options: SelectOption[];
        hasMore: boolean;
        additional: { page: number };
      }>((resolve) => {
        debounceTimerRef.current = setTimeout(() => {
          fetchParts(searchQuery, _, additional).then(resolve);
        }, 500);
      });
    },
    [fetchParts]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <AsyncPaginate
      value={selectedPart}
      loadOptions={loadOptions}
      onChange={(option) => {
        const selectedOption = option as SelectOption | null;
        if (selectedOption) {
          onChange(selectedOption.value, selectedOption.price);
        } else {
          onChange("", 0);
        }
      }}
      placeholder={placeholder}
      isSearchable
      isClearable
      loadingMessage={() => "Carregando..."}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "Nenhuma peça encontrada" : "Digite para buscar peças"
      }
      menuShouldScrollIntoView={false}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "40px",
          borderRadius: "8px",
          borderColor: error
            ? "#e53e3e"
            : state.isFocused
            ? "#ed8936"
            : "#e2e8f0",
          borderWidth: error ? "2px" : "1px",
          "&:hover": {
            borderColor: error
              ? "#e53e3e"
              : state.isFocused
              ? "#ed8936"
              : "#cbd5e0",
          },
          boxShadow: state.isFocused
            ? error
              ? "0 0 0 1px #e53e3e"
              : "0 0 0 1px #ed8936"
            : "none",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#a0aec0",
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "8px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          zIndex: 10000,
        }),
        menuList: (base) => ({
          ...base,
          maxHeight: "300px",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "4px 0",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 transparent",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#cbd5e0",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#a0aec0",
          },
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 10000,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "#ed8936"
            : state.isFocused
            ? "#fed7aa"
            : "white",
          color: state.isSelected ? "white" : "#1a202c",
          cursor: "pointer",
          "&:active": {
            backgroundColor: "#ed8936",
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: "#1a202c",
        }),
      }}
    />
  );
}
