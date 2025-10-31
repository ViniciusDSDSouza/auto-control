"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/src/components/sidebar/Sidebar";
import { Box } from "@chakra-ui/react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router, pathname]);

  return (
    <>
      <Sidebar />
      <Box
        ml={{ base: 0, lg: "260px" }}
        pt={{ base: 28, lg: 6 }}
        px={6}
        pb={6}
        minH="100vh"
        maxW="100vw"
        overflowX="hidden"
      >
        {children}
      </Box>
    </>
  );
}
