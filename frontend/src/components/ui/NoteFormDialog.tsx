"use client";

import {
  Dialog,
  Stack,
  Button,
  Text,
  HStack,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
  SelectPositioner,
  createListCollection,
  Table,
  IconButton,
  Input,
  Box,
} from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyInput } from "./CurrencyInput";
import { AsyncSelectCustomer } from "./AsyncSelectCustomer";
import { AsyncSelectCar } from "./AsyncSelectCar";
import { AsyncSelectPart } from "./AsyncSelectPart";
import { noteSchema, NoteSchema } from "@/src/modules/note/schema";
import { Note, NoteStatus } from "@/src/modules/note/types";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";

interface NoteFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NoteSchema) => Promise<void>;
  note?: Note | null;
  isLoading?: boolean;
}

export function NoteFormDialog({
  isOpen,
  onClose,
  onSubmit,
  note,
  isLoading = false,
}: NoteFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    control,
    reset,
  } = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      customerId: "",
      carId: "",
      laborPrice: 0,
      status: NoteStatus.OPEN,
      parts: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "parts",
  });

  useEffect(() => {
    if (isOpen) {
      if (note) {
        const partsData =
          note.parts?.map((p) => ({
            partId: p.partId,
            quantity: p.quantity,
            price: p.price,
          })) || [];

        if (partsData.length > 0) {
          replace(partsData);
        } else {
          replace([]);
        }

        setTimeout(() => {
          reset({
            customerId: note.customerId,
            carId: note.carId,
            laborPrice: note.laborPrice,
            status: note.status,
            parts: partsData,
          });
        }, 0);
      } else {
        replace([]);
        reset({
          customerId: "",
          carId: "",
          laborPrice: 0,
          status: NoteStatus.OPEN,
          parts: [],
        });
      }
      setPartsPrice(0);
      setTotalPrice(0);
    }
  }, [note, isOpen, reset, replace]);

  const customerIdValue = watch("customerId");
  const carIdValue = watch("carId");
  const laborPriceValue = watch("laborPrice");
  const parts = watch("parts");

  const [partsPrice, setPartsPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const updatePartsPrice = useCallback(() => {
    const currentParts = getValues("parts");
    if (!currentParts || currentParts.length === 0) {
      setPartsPrice(0);
      return;
    }

    const calculatedPartsPrice = currentParts.reduce((sum, part) => {
      const price = (part?.price as number) || 0;
      const quantity = (part?.quantity as number) || 0;
      return sum + price * quantity;
    }, 0);

    setPartsPrice(calculatedPartsPrice);
  }, [getValues]);

  useEffect(() => {
    updatePartsPrice();
  }, [parts, updatePartsPrice]);

  useEffect(() => {
    const labor = (laborPriceValue as number) || 0;
    const total = labor + partsPrice;
    setTotalPrice(total);
  }, [laborPriceValue, partsPrice]);

  const handleClose = () => {
    onClose();
  };

  const handleFormSubmit = async (data: NoteSchema) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Dialog.Content
          maxW="700px"
          maxH="90vh"
          overflowY="auto"
          overflowX="hidden"
          position="relative"
        >
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Text fontSize="xl" fontWeight="bold">
              {note ? "Editar Nota" : "Cadastrar Nota"}
            </Text>
          </Dialog.Header>
          <Dialog.Body>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack gap={4}>
                <Stack gap={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Cliente *
                  </Text>
                  <AsyncSelectCustomer
                    value={customerIdValue}
                    onChange={(value) => {
                      setValue("customerId", value, {
                        shouldValidate: true,
                      });
                      if (carIdValue && value !== customerIdValue) {
                        setValue("carId", "", {
                          shouldValidate: true,
                        });
                      }
                    }}
                    error={errors.customerId?.message}
                    placeholder="Digite para buscar um cliente"
                  />
                </Stack>

                <Stack gap={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Carro *
                  </Text>
                  <AsyncSelectCar
                    key={customerIdValue || "no-customer"}
                    value={carIdValue}
                    onChange={(value) => {
                      setValue("carId", value, {
                        shouldValidate: true,
                      });
                    }}
                    error={errors.carId?.message}
                    placeholder="Digite para buscar um carro"
                    customerId={customerIdValue}
                  />
                  {errors.carId && (
                    <Text fontSize="sm" color="red.500">
                      {errors.carId.message}
                    </Text>
                  )}
                </Stack>

                <CurrencyInput
                  label="Preço da Mão de Obra"
                  value={laborPriceValue}
                  onChange={(value) => {
                    setValue("laborPrice", value, {
                      shouldValidate: true,
                    });
                  }}
                  error={errors.laborPrice?.message}
                  size="lg"
                />

                <Stack gap={4}>
                  <HStack
                    gap={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontSize="sm" fontWeight="medium">
                      Peças
                    </Text>
                    <Button
                      size="sm"
                      colorPalette="orange"
                      onClick={() => {
                        append({
                          partId: "",
                          quantity: 1,
                          price: 0,
                        });
                        setTimeout(() => {
                          updatePartsPrice();
                        }, 0);
                      }}
                    >
                      <FaPlus style={{ marginRight: "4px" }} />
                      Adicionar Peça
                    </Button>
                  </HStack>

                  {fields.length > 0 && (
                    <Box
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="gray.200"
                      overflow="visible"
                      position="relative"
                    >
                      <Table.Root variant="outline" size="sm">
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader>Peça</Table.ColumnHeader>
                            <Table.ColumnHeader w="100px">
                              Quantidade
                            </Table.ColumnHeader>
                            <Table.ColumnHeader w="120px">
                              Preço Unit.
                            </Table.ColumnHeader>
                            <Table.ColumnHeader w="120px">
                              Subtotal
                            </Table.ColumnHeader>
                            <Table.ColumnHeader w="50px"></Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {fields.map((field, index) => {
                            const partPrice =
                              (parts?.[index]?.price as number) || 0;
                            const quantity =
                              (parts?.[index]?.quantity as number) || 0;
                            const subtotal = partPrice * quantity;

                            return (
                              <Table.Row key={field.id}>
                                <Table.Cell>
                                  <Box
                                    w="200px"
                                    position="relative"
                                    zIndex={10000 - index}
                                    overflow="visible"
                                  >
                                    <AsyncSelectPart
                                      value={
                                        (parts?.[index]?.partId as string) || ""
                                      }
                                      onChange={(partId, price) => {
                                        setValue(
                                          `parts.${index}.partId`,
                                          partId,
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          }
                                        );
                                        setValue(
                                          `parts.${index}.price`,
                                          price,
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          }
                                        );
                                        setTimeout(() => {
                                          updatePartsPrice();
                                        }, 0);
                                      }}
                                      error={
                                        errors.parts?.[index]?.partId?.message
                                      }
                                      placeholder="Selecione a peça"
                                    />
                                  </Box>
                                  {errors.parts?.[index]?.partId && (
                                    <Text fontSize="xs" color="red.500" mt={1}>
                                      {errors.parts[index]?.partId?.message}
                                    </Text>
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    size="sm"
                                    {...register(`parts.${index}.quantity`, {
                                      valueAsNumber: true,
                                      min: 1,
                                    })}
                                    onChange={(e) => {
                                      const value =
                                        parseInt(e.target.value) || 0;
                                      setValue(
                                        `parts.${index}.quantity`,
                                        value,
                                        {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                        }
                                      );
                                      setTimeout(() => {
                                        updatePartsPrice();
                                      }, 0);
                                    }}
                                  />
                                  {errors.parts?.[index]?.quantity && (
                                    <Text fontSize="xs" color="red.500" mt={1}>
                                      {errors.parts[index]?.quantity?.message}
                                    </Text>
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  <CurrencyInput
                                    value={
                                      (parts?.[index]?.price as number) || 0
                                    }
                                    onChange={(value) => {
                                      setValue(`parts.${index}.price`, value, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                      setTimeout(() => {
                                        updatePartsPrice();
                                      }, 0);
                                    }}
                                    error={
                                      errors.parts?.[index]?.price?.message
                                    }
                                    size="sm"
                                    label=""
                                  />
                                  {errors.parts?.[index]?.price && (
                                    <Text fontSize="xs" color="red.500" mt={1}>
                                      {errors.parts[index]?.price?.message}
                                    </Text>
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  <Text fontWeight="medium">
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(subtotal)}
                                  </Text>
                                </Table.Cell>
                                <Table.Cell>
                                  <IconButton
                                    aria-label="Remover peça"
                                    colorPalette="red"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      remove(index);
                                      setTimeout(() => {
                                        updatePartsPrice();
                                      }, 0);
                                    }}
                                  >
                                    <FaTrash />
                                  </IconButton>
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  )}

                  <Stack gap={2}>
                    <Stack gap={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        Preço das Peças
                      </Text>
                      <Input
                        value={new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(partsPrice)}
                        disabled
                        readOnly
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        bg="gray.50"
                      />
                    </Stack>
                    <Stack gap={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        Preço Total
                      </Text>
                      <Input
                        value={new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(totalPrice)}
                        disabled
                        readOnly
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        bg="gray.50"
                        fontWeight="bold"
                        fontSize="lg"
                        color="orange.600"
                      />
                    </Stack>
                  </Stack>
                </Stack>

                <Stack gap={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Status *
                  </Text>
                  <Select.Root
                    collection={createListCollection({
                      items: [
                        { label: "Aberta", value: NoteStatus.OPEN },
                        { label: "Paga", value: NoteStatus.PAID },
                        { label: "Cancelada", value: NoteStatus.CANCELLED },
                      ],
                    })}
                    value={watch("status") ? [watch("status")] : []}
                    onValueChange={(e) => {
                      setValue("status", e.value[0] as NoteStatus, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectPositioner>
                      <SelectContent>
                        <SelectItem
                          item={{ label: "Aberta", value: NoteStatus.OPEN }}
                        >
                          Aberta
                        </SelectItem>
                        <SelectItem
                          item={{ label: "Paga", value: NoteStatus.PAID }}
                        >
                          Paga
                        </SelectItem>
                        <SelectItem
                          item={{
                            label: "Cancelada",
                            value: NoteStatus.CANCELLED,
                          }}
                        >
                          Cancelada
                        </SelectItem>
                      </SelectContent>
                    </SelectPositioner>
                  </Select.Root>
                  {errors.status && (
                    <Text fontSize="sm" color="red.500">
                      {errors.status.message}
                    </Text>
                  )}
                </Stack>
              </Stack>
            </form>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack gap={3}>
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                colorPalette="orange"
                onClick={handleSubmit(handleFormSubmit)}
                loading={isLoading}
                loadingText="Salvando..."
              >
                {note ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
