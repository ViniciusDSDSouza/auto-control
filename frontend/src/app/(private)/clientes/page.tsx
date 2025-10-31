"use client";

import {
  Box,
  Stack,
  Input,
  Button,
  Table,
  HStack,
  IconButton,
  InputGroup,
  Icon,
  Dialog,
  Text,
} from "@chakra-ui/react";
import { CustomerTableSkeleton, CustomerFormDialog } from "@/src/components/ui";
import { useCustomersPage } from "./useCustomersPage";
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

export default function ClientesPage() {
  const {
    customers,
    isLoadingCustomers,
    search,
    setSearch,
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCloseDeleteDialog,
    isCustomerDialogOpen,
    editingCustomer,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseCustomerDialog,
    handleCustomerSubmit,
    isSavingCustomer,
  } = useCustomersPage();

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
          <Button
            colorPalette="orange"
            size="lg"
            borderRadius="lg"
            onClick={handleOpenCreateDialog}
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Cadastrar Cliente
          </Button>
        </HStack>

        {isLoadingCustomers ? (
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
                {customers.length === 0 ? (
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
                  customers.map((customer) => (
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
                            onClick={() => handleOpenEditDialog(customer)}
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
                              handleDeleteClick(customer.id, customer.name)
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

      <Dialog.Root
        open={!!deleteConfirm}
        onOpenChange={(e) => {
          if (!e.open) handleCloseDeleteDialog();
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Text fontSize="xl" fontWeight="bold">
                Confirmar exclusão
              </Text>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Tem certeza que deseja excluir o cliente{" "}
                <strong>{deleteConfirm?.name}</strong>? Esta ação não pode ser
                desfeita.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={3}>
                <Button variant="ghost" onClick={handleCloseDeleteDialog}>
                  Cancelar
                </Button>
                <Button colorPalette="red" onClick={handleDeleteConfirm}>
                  Excluir
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <CustomerFormDialog
        isOpen={isCustomerDialogOpen}
        onClose={handleCloseCustomerDialog}
        onSubmit={handleCustomerSubmit}
        customer={editingCustomer}
        isLoading={isSavingCustomer}
      />
    </Box>
  );
}
