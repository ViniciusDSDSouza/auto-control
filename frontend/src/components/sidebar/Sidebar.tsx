"use client";

import {
  Box,
  Icon,
  Stack,
  Text,
  Image,
  Button,
  useDisclosure,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { sidebarItems } from "./sidebarItems";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";

export function Sidebar() {
  const { open, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const sidebarContent = (
    <Stack
      h="100vh"
      bg="orange.500"
      w={{ base: "280px", md: "260px" }}
      gap={0}
      position="relative"
      borderRadius={{ base: "0", md: "0 20px 20px 0" }}
      overflow="hidden"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius={{ base: "0", md: "20px 0 0 0" }}
        position="relative"
        py={6}
      >
        {isMobile && (
          <Button
            position="absolute"
            top={2}
            right={2}
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar menu"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
          >
            <Icon as={FaTimes} boxSize={5} />
          </Button>
        )}
        <Image
          src="/logo-sidebar.png"
          alt="Auto Control"
          width={300}
          height={300}
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            height: "auto",
            marginBlock: -30,
          }}
        />
      </Box>

      <Box flex={1} overflowY="auto" py={4}>
        <Stack gap={1} px={3}>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
              >
                <Box
                  px={4}
                  py={3}
                  borderRadius="xl"
                  cursor="pointer"
                  bg={isActive ? "white" : "transparent"}
                  _hover={{
                    bg: isActive ? "orange.50" : "whiteAlpha.300",
                  }}
                  transition="all 0.2s"
                  borderLeft={isActive ? "3px solid" : "3px solid transparent"}
                  borderColor={isActive ? "white" : "transparent"}
                >
                  <HStack gap={3} color={isActive ? "orange.600" : "white"}>
                    <Icon as={item.icon} boxSize={5} />
                    <Text
                      fontSize="md"
                      fontWeight={isActive ? "semibold" : "normal"}
                    >
                      {item.label}
                    </Text>
                  </HStack>
                </Box>
              </Link>
            );
          })}
        </Stack>
      </Box>

      <Box p={4} borderRadius={{ base: "0", md: "0 0 20px 0" }}>
        <Button
          variant="outline"
          size="md"
          onClick={handleLogout}
          w="full"
          color="white"
          borderColor="whiteAlpha.400"
          borderRadius="lg"
          _hover={{
            bg: "whiteAlpha.100",
            borderColor: "white",
          }}
        >
          <HStack gap={2}>
            <Icon as={FaSignOutAlt} />
            <Text>Sair</Text>
          </HStack>
        </Button>
      </Box>
    </Stack>
  );

  if (isMobile) {
    return (
      <>
        <Box
          position="fixed"
          top={4}
          left={4}
          zIndex={998}
          bg="white"
          borderRadius="md"
          shadow="lg"
          p={2}
          border="1px solid"
          borderColor="orange.200"
          transform={open ? "scale(0)" : "scale(1)"}
          opacity={open ? 0 : 1}
          transition="transform 0.3s ease-in-out, opacity 0.3s ease-in-out"
          pointerEvents={open ? "none" : "auto"}
        >
          <Button
            variant="ghost"
            onClick={onOpen}
            aria-label="Abrir menu"
            _hover={{ bg: "orange.50" }}
          >
            <Icon as={FaBars} boxSize={6} color="orange.600" />
          </Button>
        </Box>

        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex={999}
          opacity={open ? 1 : 0}
          visibility={open ? "visible" : "hidden"}
          transition="opacity 0.3s ease-in-out, visibility 0.3s ease-in-out"
          onClick={onClose}
        />

        <Box
          position="fixed"
          top={0}
          left={0}
          zIndex={1000}
          h="100vh"
          borderRadius="0 20px 20px 0"
          overflow="hidden"
          transform={open ? "translateX(0)" : "translateX(-100%)"}
          transition="transform 0.3s ease-in-out"
        >
          {sidebarContent}
        </Box>
      </>
    );
  }

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      zIndex={100}
      borderRadius="0 20px 20px 0"
      overflow="hidden"
    >
      {sidebarContent}
    </Box>
  );
}
