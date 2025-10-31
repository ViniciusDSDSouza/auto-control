import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/src/store/baseQuery";
import { RegisterUserDto, LoginUserDto, LoginUserResponse } from "./types";

export const authApi = createApi({
  baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation<void, RegisterUserDto>({
      query: (data) => ({ url: "/register", method: "POST", body: data }),
    }),
    loginUser: builder.mutation<LoginUserResponse, LoginUserDto>({
      query: (data) => ({ url: "/login", method: "POST", body: data }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApi;
