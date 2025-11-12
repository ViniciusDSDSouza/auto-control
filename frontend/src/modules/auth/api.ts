import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/src/store/baseQuery";
import { RegisterUserDto, LoginUserDto, LoginUserResponse } from "./types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  keepUnusedDataFor: 900,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<void, RegisterUserDto>({
      query: (data) => ({ url: "/register", method: "POST", body: data }),
    }),
    loginUser: builder.mutation<LoginUserResponse, LoginUserDto>({
      query: (data) => ({ url: "/login", method: "POST", body: data }),
      invalidatesTags: ["Auth"],
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({ url: "/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
    checkAuth: builder.query<{ authenticated: boolean }, void>({
      query: () => ({ url: "/check-auth", method: "GET" }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useCheckAuthQuery,
} = authApi;
