"use client";

import { Stack, Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  FormInput,
  PasswordInput,
  AuthButton,
  AuthLink,
} from "@/components/ui";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <Box
      suppressHydrationWarning
      minH="100vh"
      bgGradient="linear(to-br, orange.50, orange.100)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={8}
    >
      <Box
        w="100%"
        maxW="900px"
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        borderRadius="2xl"
        overflow="hidden"
        shadow="2xl"
        bg="white"
      >
        <Box
          w={{ base: "100%", md: "40%" }}
          bgGradient="linear(to-br, orange.500, orange.600)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pl={{ base: 0, md: 8 }}
          position="relative"
          minH={{ base: "200px", md: "auto" }}
        >
          <Box position="relative" zIndex={1}>
            <Image
              src="/logo.png"
              alt="Logo Auto Control"
              width={300}
              height={300}
              priority
              style={{
                width: "auto",
                height: "auto",
              }}
            />
          </Box>
        </Box>

        <Box w={{ base: "100%", md: "60%" }} p={8}>
          <Stack gap={2} mb={6}>
            <Box fontSize="3xl" fontWeight="bold" color="orange.600">
              Login
            </Box>
            <Box color="gray.600" fontSize="md">
              Entre com sua conta para acessar o sistema
            </Box>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
              <FormInput
                label="E-mail"
                type="email"
                placeholder="Digite seu email"
                {...register("email")}
              />

              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                {...register("password")}
              />

              <AuthButton type="submit">Entrar</AuthButton>

              <AuthLink
                question="Não tem uma conta?"
                linkText="Cadastre-se"
                href="/cadastro"
              />
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
