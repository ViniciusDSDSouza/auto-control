import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/src/store/baseQuery";
import { RegisterUserDto } from "./types";

export const authApi = createApi({
  baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation<void, RegisterUserDto>({
      query: (data) => ({ url: "/register", method: "POST", body: data }),
    }),
  }),
});

export const { useRegisterUserMutation } = authApi;
