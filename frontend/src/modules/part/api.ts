import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/src/store/baseQuery";
import { Part, PartDto, GetPartsParams, PaginatedResponse } from "./types";

export const partApi = createApi({
  reducerPath: "partApi",
  baseQuery,
  tagTypes: ["Part"],
  endpoints: (builder) => ({
    getParts: builder.query<PaginatedResponse<Part>, GetPartsParams>({
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
          url: "/parts",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Part"],
    }),
    getPartById: builder.query<Part, string>({
      query: (id) => `/parts/${id}`,
      providesTags: ["Part"],
    }),
    createPart: builder.mutation<Part, PartDto>({
      query: (data) => ({ url: "/parts", method: "POST", body: data }),
      invalidatesTags: ["Part"],
    }),
    updatePart: builder.mutation<Part, { id: string; data: PartDto }>({
      query: ({ id, data }) => ({
        url: `/parts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Part"],
    }),
    deletePart: builder.mutation<void, string>({
      query: (id) => ({ url: `/parts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Part"],
    }),
  }),
});

export const {
  useGetPartsQuery,
  useGetPartByIdQuery,
  useCreatePartMutation,
  useUpdatePartMutation,
  useDeletePartMutation,
} = partApi;
