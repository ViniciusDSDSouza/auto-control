import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/src/modules/auth/api";
import { customerApi } from "@/src/modules/customer/api";
import { partApi } from "@/src/modules/part/api";
import { carApi } from "@/src/modules/car/api";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [partApi.reducerPath]: partApi.reducer,
    [carApi.reducerPath]: carApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      customerApi.middleware,
      partApi.middleware,
      carApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
