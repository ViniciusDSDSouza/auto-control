"use client";

import { Dialog, Stack, Button, Text, HStack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "./FormInput";
import { CurrencyInput } from "./CurrencyInput";
import { partSchema, PartSchema } from "@/src/modules/part/schema";
import { Part } from "@/src/modules/part/types";

interface PartFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PartSchema) => Promise<void>;
  part?: Part | null;
  isLoading?: boolean;
}

export function PartFormDialog({
  isOpen,
  onClose,
  onSubmit,
  part,
  isLoading = false,
}: PartFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PartSchema>({
    resolver: zodResolver(partSchema),
    values: part
      ? {
          name: part.name,
          model: part.model,
          price: part.price,
        }
      : {
          name: "",
          model: "",
          price: 0,
        },
  });

  const handleClose = () => {
    onClose();
  };

  const handleFormSubmit = async (data: PartSchema) => {
    const submitData = {
      name: data.name.trim(),
      model: data.model.trim(),
      price: data.price,
    };

    await onSubmit(submitData);
    reset();
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
        <Dialog.Content maxW="500px">
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Text fontSize="xl" fontWeight="bold">
              {part ? "Editar Peça" : "Cadastrar Peça"}
            </Text>
          </Dialog.Header>
          <Dialog.Body>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack gap={4}>
                <FormInput
                  label="Nome"
                  placeholder="Digite o nome da peça"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <FormInput
                  label="Modelo"
                  placeholder="Digite o modelo"
                  error={errors.model?.message}
                  {...register("model")}
                />

                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      label="Preço"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      error={errors.price?.message}
                    />
                  )}
                />
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
                {part ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
