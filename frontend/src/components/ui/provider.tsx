"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { StoreProvider } from "@/src/store/StoreProvider";
import { Toaster } from "./toaster";
import { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div suppressHydrationWarning>
        <ChakraProvider value={defaultSystem}>
          {children}
          <Toaster />
        </ChakraProvider>
      </div>
    </StoreProvider>
  );
}
