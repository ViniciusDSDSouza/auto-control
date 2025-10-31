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
import { CustomerTableSkeleton, CarFormDialog } from "@/src/components/ui";
import { useCarsGet, useCarsEdit, useCarsDelete } from "./useCarsPage";
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function CarrosPage() {
  const {
    cars,
    pagination,
    isLoadingCars,
    params,
    searchInput,
    handleSearchChange,
    handlePageChange,
    handleItemsPerPageChange,
  } = useCarsGet();

  const {
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCloseDeleteDialog,
  } = useCarsDelete();

  const {
    isCarDialogOpen,
    editingCar,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseCarDialog,
    handleCarSubmit,
    isSavingCar,
  } = useCarsEdit();

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
            Carros
          </Box>
          <Box fontSize="lg" color="gray.600" mt={1}>
            Gerencie os carros dos clientes, atualize informações e mantenha
            tudo organizado
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
              placeholder="Pesquisar por marca"
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
            Cadastrar Carro
          </Button>
        </HStack>

        {isLoadingCars ? (
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
                    minW="150px"
                    w="15%"
                    color="black"
                    pl={4}
                  >
                    Cliente
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="120px"
                    w="15%"
                    color="black"
                  >
                    Marca
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="120px"
                    w="15%"
                    color="black"
                  >
                    Modelo
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="100px"
                    w="12%"
                    color="black"
                  >
                    Placa
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="80px"
                    w="10%"
                    color="black"
                  >
                    Ano
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="100px"
                    w="12%"
                    color="black"
                  >
                    Cor
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    textAlign="center"
                    minW="120px"
                    w="21%"
                    color="black"
                  >
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cars.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={7}
                      textAlign="center"
                      py={8}
                      color="gray.500"
                    >
                      Nenhum carro encontrado
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  cars.map((car) => (
                    <Table.Row key={car.id} _hover={{ bg: "orange.50" }}>
                      <Table.Cell fontSize="lg" minW="150px" pl={4}>
                        {car.customer?.name || "N/A"}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="120px">
                        {car.brand}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="120px">
                        {car.model}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="100px">
                        {car.plate || "-"}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="80px">
                        {car.year || "-"}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="100px">
                        {car.color}
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
                            onClick={() => handleOpenEditDialog(car)}
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
                              handleDeleteClick(car.id, car.brand, car.model)
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

      <CarFormDialog
        isOpen={isCarDialogOpen}
        onClose={handleCloseCarDialog}
        onSubmit={handleCarSubmit}
        car={editingCar}
        isLoading={isSavingCar}
      />

      <Dialog.Root
        open={!!deleteConfirm}
        onOpenChange={(e) => !e.open && handleCloseDeleteDialog()}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Dialog.Content maxW="400px">
            <Dialog.Header>
              <Text fontSize="xl" fontWeight="bold">
                Confirmar Exclusão
              </Text>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Tem certeza que deseja excluir o carro{" "}
                <Text as="span" fontWeight="bold">
                  {deleteConfirm?.brand} {deleteConfirm?.model}
                </Text>
                ? Esta ação não pode ser desfeita.
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
    </Box>
  );
}
