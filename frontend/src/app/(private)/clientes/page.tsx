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
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
  SelectPositioner,
  createListCollection,
  ButtonGroup,
} from "@chakra-ui/react";
import { CustomerTableSkeleton, CustomerFormDialog } from "@/src/components/ui";
import {
  useCustomersGet,
  useCustomersEdit,
  useCustomersDelete,
} from "./useCustomersPage";
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function ClientesPage() {
  const router = useRouter();

  const {
    customers,
    pagination,
    isLoadingCustomers,
    params,
    searchInput,
    handleSearchChange,
    handlePageChange,
    handleItemsPerPageChange,
  } = useCustomersGet();

  const {
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCloseDeleteDialog,
  } = useCustomersDelete();

  const {
    isCustomerDialogOpen,
    editingCustomer,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseCustomerDialog,
    handleCustomerSubmit,
    isSavingCustomer,
  } = useCustomersEdit();

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
              placeholder="Pesquisar por nome"
              value={searchInput || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
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
                    pl={4}
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
                      <Table.Cell fontSize="lg" minW="200px" pl={4}>
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
                            <FaEye
                              onClick={() =>
                                router.push(`/clientes/${customer.id}`)
                              }
                            />
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

            {pagination && (
              <Box
                borderTopWidth="1px"
                px={6}
                py={4}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <HStack gap={2} alignItems="center">
                  <Text fontSize="sm" color="gray.600">
                    Itens por página:
                  </Text>
                  <Select.Root
                    collection={createListCollection({
                      items: [
                        { label: "5", value: "5" },
                        { label: "10", value: "10" },
                        { label: "25", value: "25" },
                      ],
                    })}
                    value={[params.itemsPerPage?.toString() || "10"]}
                    onValueChange={(details) =>
                      handleItemsPerPageChange(Number(details.value[0]))
                    }
                    positioning={{ placement: "bottom-start" }}
                    closeOnSelect={true}
                  >
                    <SelectTrigger w="60px">
                      <SelectValueText />
                    </SelectTrigger>
                    <SelectPositioner w="60px">
                      <SelectContent>
                        <SelectItem item={{ label: "5", value: "5" }}>
                          5
                        </SelectItem>
                        <SelectItem item={{ label: "10", value: "10" }}>
                          10
                        </SelectItem>
                        <SelectItem item={{ label: "25", value: "25" }}>
                          25
                        </SelectItem>
                      </SelectContent>
                    </SelectPositioner>
                  </Select.Root>
                </HStack>

                <Pagination.Root
                  count={pagination?.totalItems || 0}
                  pageSize={params.itemsPerPage || 10}
                  page={pagination?.page || 1}
                  onPageChange={(details) => handlePageChange(details.page)}
                  siblingCount={2}
                >
                  <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                      <IconButton
                        aria-label="Página anterior"
                        colorPalette="orange"
                        borderRadius="md"
                        w="36px"
                        h="36px"
                      >
                        <LuChevronLeft />
                      </IconButton>
                    </Pagination.PrevTrigger>

                    <Pagination.Items
                      render={(page) => {
                        const isCurrentPage =
                          page.type === "page" &&
                          pagination?.page === page.value;
                        return (
                          <Pagination.Item
                            key={
                              page.type === "page"
                                ? page.value
                                : `page-${page.value}`
                            }
                            value={page.value}
                            type={page.type}
                            aria-label={`Página ${page.value}`}
                            w="36px"
                            h="36px"
                            minW="36px"
                            p={0}
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg={isCurrentPage ? "orange.500" : "transparent"}
                            color={isCurrentPage ? "white" : "orange.500"}
                            borderWidth={isCurrentPage ? "0" : "1px"}
                            borderColor="orange.500"
                            cursor="pointer"
                            _hover={{
                              bg: isCurrentPage ? "orange.600" : "orange.50",
                            }}
                            transition="all 0.2s"
                          >
                            {page.type === "page" ? page.value : "..."}
                          </Pagination.Item>
                        );
                      }}
                    />

                    <Pagination.NextTrigger asChild>
                      <IconButton
                        aria-label="Próxima página"
                        colorPalette="orange"
                        borderRadius="md"
                        w="36px"
                        h="36px"
                      >
                        <LuChevronRight />
                      </IconButton>
                    </Pagination.NextTrigger>
                  </ButtonGroup>
                </Pagination.Root>
              </Box>
            )}
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
