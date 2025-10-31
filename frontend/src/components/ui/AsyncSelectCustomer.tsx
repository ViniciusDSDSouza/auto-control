"use client";

import { AsyncPaginate } from "react-select-async-paginate";
import { GroupBase, OptionsOrGroups } from "react-select";
import { useMemo } from "react";
import { useGetCustomerByIdQuery } from "@/src/modules/customer/api";
import type { Customer } from "@/src/modules/customer/types";

interface SelectOption {
  value: string;
  label: string;
}

interface AsyncSelectCustomerProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function AsyncSelectCustomer({
  value,
  onChange,
  error,
  placeholder = "Selecione um cliente",
}: AsyncSelectCustomerProps) {
  const { data: customerData } = useGetCustomerByIdQuery(value || "", {
    skip: !value,
  });

  const selectedCustomer = useMemo<SelectOption | null>(() => {
    if (customerData && value && customerData.id === value) {
      return {
        value: customerData.id,
        label: customerData.name,
      };
    }
    return null;
  }, [customerData, value]);

  const loadOptions = async (
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
      orderBy: "name",
      orderDirection: "asc",
    });

    if (searchQuery) {
      queryParams.append("name", searchQuery);
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/customers?${queryParams}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar clientes");
    }

    const data = await response.json();
    const customers: Customer[] = data.data || [];
    const pagination = data.pagination;

    const options: SelectOption[] = customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
    }));

    return {
      options,
      hasMore: pagination?.hasNext || false,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <AsyncPaginate
      value={selectedCustomer}
      loadOptions={loadOptions}
      onChange={(option) => {
        const selectedOption = option as SelectOption | null;
        onChange(selectedOption ? selectedOption.value : "");
      }}
      placeholder={placeholder}
      isSearchable
      isClearable
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
