"use client";

import { useOverviewPage } from "./useOverviewPage";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Stack,
  Tabs,
  Text,
  Table,
  HStack,
  Badge,
  Skeleton,
} from "@chakra-ui/react";
import { CustomerTableSkeleton } from "@/src/components/ui";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { formatDate } from "@/src/libs/formatDate";
import { formatCurrency } from "@/src/libs/formatCurrency";
import { NoteStatus } from "@/src/modules/note/types";
import { getStatusBadgeColor, getStatusLabel } from "@/src/libs/noteStatus";

export default function ClientesOverviewPage() {
  const { id } = useParams();
  const { customer, isLoadingCustomer, notes, cars } = useOverviewPage(
    id as string
  );

  return (
    <Box>
      <Stack gap={6}>
        <Box>
          <HStack gap={2} mb={2} alignItems="center">
            <Link href="/clientes">
              <Text
                fontSize="md"
                color="gray.500"
                _hover={{ color: "orange.600", textDecoration: "underline" }}
                cursor="pointer"
                transition="color 0.2s"
              >
                Clientes
              </Text>
            </Link>
            <Text fontSize="md" color="gray.400">
              /
            </Text>
            {isLoadingCustomer ? (
              <Skeleton height="20px" width="200px" />
            ) : (
              <Text fontSize="md" color="gray.700" fontWeight="medium">
                {customer?.name || "Cliente"}
              </Text>
            )}
          </HStack>
          <Box
            fontSize="4xl"
            fontWeight="bold"
            color="orange.600"
            letterSpacing="tight"
          >
            {isLoadingCustomer ? (
              <Skeleton height="40px" width="300px" />
            ) : (
              customer?.name || "Cliente"
            )}
          </Box>
          <Box fontSize="lg" color="gray.600" mt={1}>
            Visão detalhada do cliente e suas informações
          </Box>
        </Box>

        <Tabs.Root defaultValue="overview">
          <Tabs.List>
            <Tabs.Trigger value="overview">Visão Geral</Tabs.Trigger>
            <Tabs.Trigger value="notes">Notas</Tabs.Trigger>
            <Tabs.Trigger value="cars">Veículos</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">
            {isLoadingCustomer ? (
              <Box
                borderWidth="1px"
                borderRadius="xl"
                p={6}
                bg="white"
                shadow="sm"
              >
                <Stack gap={4}>
                  <Skeleton height="24px" width="200px" />
                  <Skeleton height="20px" width="150px" />
                  <Skeleton height="20px" width="150px" />
                </Stack>
              </Box>
            ) : customer ? (
              <Box
                borderWidth="1px"
                borderRadius="xl"
                p={6}
                bg="white"
                shadow="sm"
              >
                <Stack gap={6}>
                  <Box>
                    <HStack gap={3} mb={4}>
                      <Box
                        p={3}
                        borderRadius="lg"
                        bg="orange.50"
                        color="orange.600"
                      >
                        <FaUser size={20} />
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>
                          Nome Completo
                        </Text>
                        <Text fontSize="xl" fontWeight="bold">
                          {customer.name}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  {customer.email && (
                    <Box>
                      <HStack gap={3} mb={4}>
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg="blue.50"
                          color="blue.600"
                        >
                          <FaEnvelope size={20} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            Email
                          </Text>
                          <Text fontSize="lg" color="gray.700">
                            {customer.email}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  )}

                  {customer.phone && (
                    <Box>
                      <HStack gap={3} mb={4}>
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg="green.50"
                          color="green.600"
                        >
                          <FaPhone size={20} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            Telefone
                          </Text>
                          <Text fontSize="lg" color="gray.700">
                            {customer.phone}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  )}

                  <Box
                    borderTopWidth="1px"
                    borderColor="gray.200"
                    pt={4}
                    mt={2}
                  >
                    <Stack gap={2}>
                      <HStack justifyContent="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Data de Cadastro
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {formatDate(customer.createdAt)}
                        </Text>
                      </HStack>
                      <HStack justifyContent="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Última Atualização
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {formatDate(customer.updatedAt)}
                        </Text>
                      </HStack>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Box
                borderWidth="1px"
                borderRadius="xl"
                p={6}
                bg="white"
                shadow="sm"
                textAlign="center"
              >
                <Text color="gray.500">Cliente não encontrado</Text>
              </Box>
            )}
          </Tabs.Content>
          <Tabs.Content value="notes">
            {isLoadingCustomer ? (
              <CustomerTableSkeleton />
            ) : (
              <Box
                borderWidth="1px"
                borderRadius="xl"
                overflowX="auto"
                bg="white"
                shadow="sm"
              >
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="200px"
                        w="35%"
                        color="black"
                        pl={4}
                      >
                        Carro
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="120px"
                        w="20%"
                        color="black"
                      >
                        Total
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="100px"
                        w="15%"
                        color="black"
                      >
                        Status
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="120px"
                        w="30%"
                        color="black"
                      >
                        Data
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {notes.length === 0 ? (
                      <Table.Row>
                        <Table.Cell
                          colSpan={4}
                          textAlign="center"
                          py={8}
                          color="gray.500"
                        >
                          Nenhuma nota encontrada
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      notes.map((note) => (
                        <Table.Row key={note.id} _hover={{ bg: "orange.50" }}>
                          <Table.Cell fontSize="lg" minW="200px" pl={4} py={4}>
                            {note.car
                              ? `${note.car.brand} ${note.car.model}${
                                  note.car.plate ? ` - ${note.car.plate}` : ""
                                }`
                              : "-"}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="lg"
                            color="gray.600"
                            minW="120px"
                            py={4}
                          >
                            {formatCurrency(note.totalPrice)}
                          </Table.Cell>
                          <Table.Cell minW="100px" py={4}>
                            <Badge
                              colorPalette={getStatusBadgeColor(
                                note.status as NoteStatus
                              )}
                              size="lg"
                            >
                              {getStatusLabel(note.status as NoteStatus)}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell
                            fontSize="lg"
                            color="gray.600"
                            minW="120px"
                            py={4}
                          >
                            {formatDate(note.createdAt)}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </Tabs.Content>
          <Tabs.Content value="cars">
            {isLoadingCustomer ? (
              <CustomerTableSkeleton />
            ) : (
              <Box
                borderWidth="1px"
                borderRadius="xl"
                overflowX="auto"
                bg="white"
                shadow="sm"
              >
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="120px"
                        w="25%"
                        color="black"
                        pl={4}
                      >
                        Marca
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="120px"
                        w="25%"
                        color="black"
                      >
                        Modelo
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="100px"
                        w="20%"
                        color="black"
                      >
                        Placa
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="80px"
                        w="15%"
                        color="black"
                      >
                        Ano
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        fontSize="xs"
                        fontWeight="bold"
                        minW="100px"
                        w="15%"
                        color="black"
                      >
                        Cor
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {cars.length === 0 ? (
                      <Table.Row>
                        <Table.Cell
                          colSpan={5}
                          textAlign="center"
                          py={8}
                          color="gray.500"
                        >
                          Nenhum veículo encontrado
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      cars.map((car) => (
                        <Table.Row key={car.id} _hover={{ bg: "orange.50" }}>
                          <Table.Cell
                            fontSize="lg"
                            minW="120px"
                            pl={4}
                            h="61px"
                          >
                            {car.brand}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="lg"
                            color="gray.600"
                            minW="120px"
                            h="61px"
                          >
                            {car.model}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="lg"
                            color="gray.600"
                            minW="100px"
                            h="61px"
                          >
                            {car.plate || "-"}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="lg"
                            color="gray.600"
                            minW="80px"
                            h="61px"
                          >
                            {car.year || "-"}
                          </Table.Cell>
                          <Table.Cell
                            fontSize="lg"
                            color="gray.600"
                            minW="100px"
                            h="61px"
                          >
                            {car.color}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </Box>
  );
}
