import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "./api";
import { CustomerDto, GetCustomersParams } from "./types";
import { toaster } from "@/src/components/ui/toaster";

export function useGetCustomers(params?: GetCustomersParams) {
  const queryParams: GetCustomersParams = {
    page: params?.page || 1,
    itemsPerPage: params?.itemsPerPage || 10,
    orderBy: params?.orderBy || "updatedAt",
    orderDirection: params?.orderDirection || "desc",
  };

  if (params?.name) {
    queryParams.name = params.name;
  }

  const { data, isLoading } = useGetCustomersQuery(queryParams);

  return {
    customers: data?.data || [],
    pagination: data?.pagination,
    isLoading,
  };
}

export function useCreateCustomer() {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  async function handleCreateCustomer(data: CustomerDto) {
    try {
      const response = await createCustomer(data).unwrap();

      toaster.create({
        title: "Cliente cadastrado com sucesso!",
        description: `${response.name} foi adicionado à lista de clientes.`,
        type: "success",
        duration: 5000,
      });

      return response;
    } catch (error) {
      toaster.create({
        title: "Erro ao cadastrar cliente!",
        description: "Por favor, tente novamente.",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleCreateCustomer,
    isLoading,
  };
}

export function useUpdateCustomer() {
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

  async function handleUpdateCustomer(id: string, data: CustomerDto) {
    try {
      const response = await updateCustomer({ id, data }).unwrap();

      toaster.create({
        title: "Cliente atualizado com sucesso!",
        description: `As informações de ${response.name} foram atualizadas.`,
        type: "success",
        duration: 5000,
      });

      return response;
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar cliente!",
        description: "Por favor, tente novamente.",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleUpdateCustomer,
    isLoading,
  };
}

export function useDeleteCustomer() {
  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation();

  async function handleDeleteCustomer(id: string, name: string) {
    try {
      await deleteCustomer(id).unwrap();

      toaster.create({
        title: "Cliente excluído!",
        description: `${name} foi removido com sucesso.`,
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Erro desconhecido ao excluir cliente";

      toaster.create({
        title: "Erro!",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleDeleteCustomer,
    isLoading,
  };
}
