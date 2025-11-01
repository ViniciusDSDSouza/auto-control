import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/src/store/baseQuery";
import { Note, NoteDto, GetNotesParams, PaginatedResponse } from "./types";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery,
  tagTypes: ["Note"],
  endpoints: (builder) => ({
    getNotes: builder.query<PaginatedResponse<Note>, GetNotesParams>({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        if (params.page) queryParams.page = params.page.toString();
        if (params.itemsPerPage)
          queryParams.itemsPerPage = params.itemsPerPage.toString();
        if (params.customerId) queryParams.customerId = params.customerId;
        if (params.carId) queryParams.carId = params.carId;
        if (params.status) queryParams.status = params.status;
        if (params.dateRangeFrom)
          queryParams.dateRangeFrom = params.dateRangeFrom;
        if (params.dateRangeTo) queryParams.dateRangeTo = params.dateRangeTo;
        if (params.orderBy) queryParams.orderBy = params.orderBy;
        if (params.orderDirection)
          queryParams.orderDirection = params.orderDirection;

        return {
          url: "/notes",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Note"],
    }),
    getNoteById: builder.query<Note, string>({
      query: (id) => `/notes/${id}`,
      providesTags: ["Note"],
    }),
    createNote: builder.mutation<Note, NoteDto>({
      query: (data) => ({ url: "/notes", method: "POST", body: data }),
      invalidatesTags: ["Note"],
    }),
    updateNote: builder.mutation<Note, { id: string; data: NoteDto }>({
      query: ({ id, data }) => ({
        url: `/notes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Note"],
    }),
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({ url: `/notes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;
