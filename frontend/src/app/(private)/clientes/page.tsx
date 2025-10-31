"use client";

import {
  Box,
  Stack,
  Input,
  Button,
  Table,
  Skeleton,
  HStack,
  IconButton,
  InputGroup,
  Icon,
} from "@chakra-ui/react";
import {
  useGetCustomersQuery,
  useDeleteCustomerMutation,
} from "@/src/modules/customer/api";
import { useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toaster } from "@/src/components/ui/toaster";

const TableSkeleton = () => (
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
          <Table.ColumnHeader minW="200px">Cliente</Table.ColumnHeader>
          <Table.ColumnHeader minW="180px">Email</Table.ColumnHeader>
          <Table.ColumnHeader minW="140px">Telefone</Table.ColumnHeader>
          <Table.ColumnHeader minW="120px">Ações</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[...Array(5)].map((_, index) => (
          <Table.Row key={index}>
            <Table.Cell minW="200px">
              <Skeleton height="20px" borderRadius="md" />
            </Table.Cell>
            <Table.Cell minW="180px">
              <Skeleton height="20px" borderRadius="md" />
            </Table.Cell>
            <Table.Cell minW="140px">
              <Skeleton height="20px" borderRadius="md" />
            </Table.Cell>
            <Table.Cell minW="120px">
              <Skeleton height="20px" borderRadius="md" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Box>
);

export default function ClientesPage() {
  const { data: customers = [], isLoading } = useGetCustomersQuery();
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteCustomer(id).unwrap();
      toaster.create({
        title: "Cliente excluído!",
        description: `${name} foi removido com sucesso.`,
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Erro ao excluir cliente!",
        description: "Por favor, tente novamente.",
        type: "error",
      });
    }
  };

  return (
    <Box>
      <Stack gap={6}>
        <Box>
          <Box
            fontSize="4xl"
            fontWeight="bold"
            color="orange.600"
            letterSpacing="tight"
          >
            Clientes
          </Box>
          <Box fontSize="lg" color="gray.600" mt={1}>
            Gerencie seus clientes, atualize informações e mantenha tudo
            organizado
          </Box>
        </Box>

        <HStack gap={3} alignItems="center" justifyContent="space-between">
          <InputGroup
            maxW="400px"
            startElement={
              <Box display="flex" alignItems="center" px={1} color="gray.500">
                <Icon as={FaSearch} boxSize={4} />
              </Box>
            }
          >
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
              fontSize="md"
              borderRadius="lg"
            />
          </InputGroup>
          <Button colorPalette="orange" size="lg" borderRadius="lg">
            <FaPlus style={{ marginRight: "8px" }} />
            Cadastrar Cliente
          </Button>
        </HStack>

        {isLoading ? (
          <TableSkeleton />
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
                    w="40%"
                    color="black"
                  >
                    Nome Completo
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="180px"
                    w="25%"
                    color="black"
                  >
                    Email
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="140px"
                    w="20%"
                    color="black"
                  >
                    Telefone
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    textAlign="center"
                    minW="120px"
                    w="15%"
                    color="black"
                  >
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredCustomers.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={4}
                      textAlign="center"
                      py={8}
                      color="gray.500"
                    >
                      Nenhum cliente encontrado
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredCustomers.map((customer) => (
                    <Table.Row key={customer.id} _hover={{ bg: "orange.50" }}>
                      <Table.Cell fontSize="lg" minW="200px">
                        {customer.name}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="180px">
                        {customer.email || "-"}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="140px">
                        {customer.phone || "-"}
                      </Table.Cell>
                      <Table.Cell minW="120px">
                        <HStack gap={2} justifyContent="center">
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="Visualizar"
                            colorPalette="blue"
                            _hover={{ bg: "transparent" }}
                          >
                            <FaEye />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="Editar"
                            colorPalette="orange"
                            _hover={{ bg: "transparent" }}
                          >
                            <FaEdit />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="Excluir"
                            colorPalette="red"
                            onClick={() =>
                              handleDelete(customer.id, customer.name)
                            }
                            _hover={{ bg: "transparent" }}
                          >
                            <FaTrash />
                          </IconButton>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
