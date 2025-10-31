import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/src/store/baseQuery";
import {
  Customer,
  CustomerDto,
  GetCustomersParams,
  PaginatedResponse,
} from "./types";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getCustomers: builder.query<
      PaginatedResponse<Customer>,
      GetCustomersParams
    >({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        if (params.page) queryParams.page = params.page.toString();
        if (params.itemsPerPage)
          queryParams.itemsPerPage = params.itemsPerPage.toString();
        if (params.name) queryParams.name = params.name;
        if (params.orderBy) queryParams.orderBy = params.orderBy;
        if (params.orderDirection)
          queryParams.orderDirection = params.orderDirection;

        return {
          url: "/customers",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Customer"],
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation<Customer, CustomerDto>({
      query: (data) => ({ url: "/customers", method: "POST", body: data }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<
      Customer,
      { id: string; data: CustomerDto }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({ url: `/customers/${id}`, method: "DELETE" }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
