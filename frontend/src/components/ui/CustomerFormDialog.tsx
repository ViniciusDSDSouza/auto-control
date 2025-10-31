"use client";

import { Dialog, Stack, Button, Text, HStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";
import { FormInput } from "./FormInput";
import { PhoneInput } from "./PhoneInput";
import { customerSchema, CustomerSchema } from "@/src/modules/customer/schema";
import { Customer } from "@/src/modules/customer/types";

interface CustomerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerSchema) => Promise<void>;
  customer?: Customer | null;
  isLoading?: boolean;
}

export function CustomerFormDialog({
  isOpen,
  onClose,
  onSubmit,
  customer,
  isLoading = false,
}: CustomerFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    values: customer
      ? {
          name: customer.name,
          email: customer.email || "",
          phone: customer.phone || "",
        }
      : {
          name: "",
          email: "",
          phone: "",
        },
  });

  const registerWithMask = useHookFormMask(register);

  const handleClose = () => {
    onClose();
  };

  const handleFormSubmit = async (data: CustomerSchema) => {
    let phoneValue = data.phone?.trim();
    if (phoneValue) {
      phoneValue = phoneValue.replace(/_/g, "");
      const numbers = phoneValue.replace(/\D/g, "");
      if (numbers.length < 10 || numbers.length > 11) {
        phoneValue = undefined;
      }
    }

    const submitData = {
      name: data.name,
      email: data.email?.trim() || undefined,
      phone: phoneValue || undefined,
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
              {customer ? "Editar Cliente" : "Cadastrar Cliente"}
            </Text>
          </Dialog.Header>
          <Dialog.Body>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack gap={4}>
                <FormInput
                  label="Nome Completo"
                  placeholder="Digite o nome completo"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <FormInput
                  label="E-mail"
                  type="email"
                  placeholder="Digite o e-mail"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <PhoneInput
                  label="Telefone"
                  error={errors.phone?.message}
                  {...registerWithMask(
                    "phone",
                    ["(99) 9999-9999", "(99) 9 9999-9999"],
                    {
                      removeMaskOnSubmit: false,
                      keepStatic: true,
                    }
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
                {customer ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
