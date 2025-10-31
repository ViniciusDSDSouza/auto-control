import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/src/store/baseQuery";
import { Car, CarDto, GetCarsParams, PaginatedResponse } from "./types";

export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery,
  tagTypes: ["Car"],
  endpoints: (builder) => ({
    getCars: builder.query<PaginatedResponse<Car>, GetCarsParams>({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        if (params.page) queryParams.page = params.page.toString();
        if (params.itemsPerPage)
          queryParams.itemsPerPage = params.itemsPerPage.toString();
        if (params.brand) queryParams.brand = params.brand;
        if (params.customerId) queryParams.customerId = params.customerId;
        if (params.orderBy) queryParams.orderBy = params.orderBy;
        if (params.orderDirection)
          queryParams.orderDirection = params.orderDirection;

        return {
          url: "/cars",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Car"],
    }),
    getCarById: builder.query<Car, string>({
      query: (id) => `/cars/${id}`,
      providesTags: ["Car"],
    }),
    createCar: builder.mutation<Car, CarDto>({
      query: (data) => ({ url: "/cars", method: "POST", body: data }),
      invalidatesTags: ["Car"],
    }),
    updateCar: builder.mutation<Car, { id: string; data: CarDto }>({
      query: ({ id, data }) => ({
        url: `/cars/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Car"],
    }),
    deleteCar: builder.mutation<void, string>({
      query: (id) => ({ url: `/cars/${id}`, method: "DELETE" }),
      invalidatesTags: ["Car"],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carApi;
