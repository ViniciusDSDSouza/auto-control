"use client";

import {
  Box,
  Stack,
  Button,
  Table,
  HStack,
  IconButton,
  Dialog,
  Text,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
  SelectPositioner,
  createListCollection,
  Pagination,
  ButtonGroup,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { NoteFormDialog, CustomerTableSkeleton } from "@/src/components/ui";
import { useNotesGet, useNotesEdit, useNotesDelete } from "./useNotesPage";
import { FaPlus, FaEdit, FaTrash, FaCalendar } from "react-icons/fa";
import { NoteStatus } from "@/src/modules/note/types";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { DateRangePicker } from "@/src/components/ui/dateRangePicker/DateRangePicker";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { formatDate, formatDateRange } from "@/src/libs/formatDate";
import { formatCurrency } from "@/src/libs/formatCurrency";

function getStatusBadgeColor(status: NoteStatus) {
  switch (status) {
    case NoteStatus.OPEN:
      return "yellow";
    case NoteStatus.PAID:
      return "green";
    case NoteStatus.CANCELLED:
      return "red";
    default:
      return "gray";
  }
}

function getStatusLabel(status: NoteStatus) {
  switch (status) {
    case NoteStatus.OPEN:
      return "Aberta";
    case NoteStatus.PAID:
      return "Paga";
    case NoteStatus.CANCELLED:
      return "Cancelada";
    default:
      return status;
  }
}

export default function NotasPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const {
    notes,
    pagination,
    isLoadingNotes,
    params,
    handlePageChange,
    handleItemsPerPageChange,
    handleDateRangeChange,
  } = useNotesGet();

  const {
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCloseDeleteDialog,
  } = useNotesDelete();

  const {
    isNoteDialogOpen,
    editingNote,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseNoteDialog,
    handleNoteSubmit,
    isSavingNote,
  } = useNotesEdit();

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
            Notas
          </Box>
          <Box fontSize="lg" color="gray.600" mt={1}>
            Gerencie suas notas fiscais, visualize status e mantenha tudo
            organizado
          </Box>
        </Box>

        <HStack gap={3} alignItems="center" justifyContent="space-between">
          <Popover.Root id="date-range-picker">
            <Popover.Trigger asChild w={280}>
              <Button colorPalette="orange" size="lg">
                <FaCalendar />
                <Text ml={2}>
                  {dateRange
                    ? formatDateRange(dateRange)
                    : "Selecionar período"}
                </Text>
              </Button>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content className="translate-x-[5%]">
                  <DateRangePicker
                    defaultDateRange={dateRange}
                    onDateRangeChange={(newDateRange) => {
                      setDateRange(newDateRange);
                      handleDateRangeChange(
                        newDateRange?.from?.toISOString(),
                        newDateRange?.to?.toISOString()
                      );
                    }}
                  />
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>

          <Box flex={1} />
          <Button
            colorPalette="orange"
            onClick={handleOpenCreateDialog}
            size="lg"
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Nova Nota
          </Button>
        </HStack>

        {isLoadingNotes ? (
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
                    w="25%"
                    color="black"
                    pl={4}
                  >
                    Cliente
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="180px"
                    w="25%"
                    color="black"
                  >
                    Carro
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="120px"
                    w="15%"
                    color="black"
                  >
                    Total
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="100px"
                    w="12%"
                    color="black"
                  >
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    minW="120px"
                    w="13%"
                    color="black"
                  >
                    Data
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    fontSize="xs"
                    fontWeight="bold"
                    textAlign="center"
                    minW="120px"
                    w="10%"
                    color="black"
                  >
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {notes.length === 0 ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={6}
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
                      <Table.Cell fontSize="lg" minW="200px" pl={4}>
                        {note.customer?.name || "-"}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="180px">
                        {note.car
                          ? `${note.car.brand} ${note.car.model}${
                              note.car.plate ? ` - ${note.car.plate}` : ""
                            }`
                          : "-"}
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="120px">
                        {formatCurrency(note.totalPrice)}
                      </Table.Cell>
                      <Table.Cell minW="100px">
                        <Badge
                          colorPalette={getStatusBadgeColor(note.status)}
                          size="lg"
                        >
                          {getStatusLabel(note.status)}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell fontSize="lg" color="gray.600" minW="120px">
                        {formatDate(note.createdAt)}
                      </Table.Cell>
                      <Table.Cell minW="120px">
                        <HStack gap={2} justifyContent="center">
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="Editar nota"
                            colorPalette="orange"
                            onClick={() => handleOpenEditDialog(note)}
                            _hover={{ bg: "transparent" }}
                          >
                            <FaEdit />
                          </IconButton>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label="Excluir nota"
                            colorPalette="red"
                            onClick={() => handleDeleteClick(note.id)}
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
                        { label: "50", value: "50" },
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
                        <SelectItem item={{ label: "50", value: "50" }}>
                          50
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

      <NoteFormDialog
        isOpen={isNoteDialogOpen}
        onClose={handleCloseNoteDialog}
        onSubmit={handleNoteSubmit}
        note={editingNote}
        isLoading={isSavingNote}
      />

      <Dialog.Root
        open={!!deleteConfirm}
        onOpenChange={(e) => !e.open && handleCloseDeleteDialog()}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Text fontSize="xl" fontWeight="bold">
                Confirmar Exclusão
              </Text>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Tem certeza que deseja excluir esta nota? Esta ação não pode ser
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
    </Box>
  );
}
