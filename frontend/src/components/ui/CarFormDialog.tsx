"use client";

import { Dialog, Stack, Button, Text, HStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "./FormInput";
import { AsyncSelectCustomer } from "./AsyncSelectCustomer";
import { carSchema, CarSchema } from "@/src/modules/car/schema";
import { Car } from "@/src/modules/car/types";

interface CarFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CarSchema) => Promise<void>;
  car?: Car | null;
  isLoading?: boolean;
}

export function CarFormDialog({
  isOpen,
  onClose,
  onSubmit,
  car,
  isLoading = false,
}: CarFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CarSchema>({
    resolver: zodResolver(carSchema),
    values: car
      ? {
          customerId: car.customerId,
          brand: car.brand,
          model: car.model,
          plate: car.plate || "",
          year: car.year || undefined,
          color: car.color,
        }
      : {
          customerId: "",
          brand: "",
          model: "",
          plate: "",
          year: undefined,
          color: "",
        },
  });

  const customerIdValue = watch("customerId");

  const handleClose = () => {
    onClose();
  };

  const handleFormSubmit = async (data: CarSchema) => {
    const submitData = {
      customerId: data.customerId,
      brand: data.brand.trim(),
      model: data.model.trim(),
      plate: data.plate?.trim() || undefined,
      year: data.year || undefined,
      color: data.color.trim(),
    };

    await onSubmit(submitData);
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
              {car ? "Editar Carro" : "Cadastrar Carro"}
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
                    }}
                    error={errors.customerId?.message}
                    placeholder="Digite para buscar um cliente"
                  />
                </Stack>

                <FormInput
                  label="Marca"
                  placeholder="Digite a marca"
                  error={errors.brand?.message}
                  {...register("brand")}
                />

                <FormInput
                  label="Modelo"
                  placeholder="Digite o modelo"
                  error={errors.model?.message}
                  {...register("model")}
                />

                <FormInput
                  label="Placa"
                  placeholder="Digite a placa (opcional)"
                  error={errors.plate?.message}
                  {...register("plate")}
                />

                <FormInput
                  label="Ano"
                  type="number"
                  placeholder="Ex: 2024"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  error={errors.year?.message}
                  {...register("year", {
                    valueAsNumber: true,
                    onChange: (e) => {
                      const value = e.target.value;
                      // Limita a 4 dígitos
                      if (value.length > 4) {
                        e.target.value = value.slice(0, 4);
                      }
                    },
                  })}
                />

                <FormInput
                  label="Cor"
                  placeholder="Digite a cor"
                  error={errors.color?.message}
                  {...register("color")}
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
                {car ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
