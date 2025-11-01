"use client";

import { AsyncPaginate } from "react-select-async-paginate";
import { GroupBase, OptionsOrGroups } from "react-select";
import { useMemo, useEffect, useCallback, useRef } from "react";
import { useGetCarByIdQuery } from "@/src/modules/car/api";
import type { Car } from "@/src/modules/car/types";

interface SelectOption {
  value: string;
  label: string;
}

interface AsyncSelectCarProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  customerId?: string;
}

export function AsyncSelectCar({
  value,
  onChange,
  error,
  placeholder = "Selecione um carro",
  customerId,
}: AsyncSelectCarProps) {
  const { data: carData } = useGetCarByIdQuery(value || "", {
    skip: !value,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedCar = useMemo<SelectOption | null>(() => {
    if (carData && value && carData.id === value) {
      return {
        value: carData.id,
        label: `${carData.brand} ${carData.model}${
          carData.plate ? ` - ${carData.plate}` : ""
        }`,
      };
    }
    return null;
  }, [carData, value]);

  const fetchCars = useCallback(
    async (
      searchQuery: string,
      _: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
      additional?: { page: number }
    ) => {
      const page = additional?.page || 1;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("token");

      if (!baseUrl) {
        throw new Error("URL da API não configurada");
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        itemsPerPage: "4",
        orderBy: "brand",
        orderDirection: "asc",
      });

      if (customerId) {
        queryParams.append("customerId", customerId);
      }

      if (searchQuery) {
        queryParams.append("brand", searchQuery);
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/cars?${queryParams}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar carros");
      }

      const data = await response.json();
      const cars: Car[] = data.data || [];
      const pagination = data.pagination;

      const options: SelectOption[] = cars.map((car) => ({
        value: car.id,
        label: `${car.brand} ${car.model}${car.plate ? ` - ${car.plate}` : ""}`,
      }));

      return {
        options,
        hasMore: pagination?.hasNext || false,
        additional: {
          page: page + 1,
        },
      };
    },
    [customerId]
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
          fetchCars(searchQuery, _, additional).then(resolve);
        }, 500);
      });
    },
    [fetchCars]
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
      value={selectedCar}
      loadOptions={loadOptions}
      onChange={(option) => {
        const selectedOption = option as SelectOption | null;
        onChange(selectedOption ? selectedOption.value : "");
      }}
      placeholder={placeholder}
      isSearchable
      isClearable
      loadingMessage={() => "Carregando..."}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "Nenhum carro encontrado" : "Digite para buscar carros"
      }
      additional={{
        page: 1,
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "48px",
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
          zIndex: 9999,
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
