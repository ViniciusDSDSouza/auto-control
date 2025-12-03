import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseQueryWithCredentials = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ""),
  credentials: "include",
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithCredentials(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (
        !currentPath.startsWith("/login") &&
        !currentPath.startsWith("/cadastro")
      ) {
        window.location.href = "/login";
      }
    }
  }

  return result;
};
