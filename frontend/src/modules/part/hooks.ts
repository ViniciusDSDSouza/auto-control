import {
  useGetPartsQuery,
  useCreatePartMutation,
  useUpdatePartMutation,
  useDeletePartMutation,
} from "./api";
import { PartDto, GetPartsParams } from "./types";
import { toaster } from "@/src/components/ui/toaster";

export function useGetParts(params?: GetPartsParams) {
  const queryParams: GetPartsParams = {
    page: params?.page || 1,
    itemsPerPage: params?.itemsPerPage || 10,
    orderBy: params?.orderBy || "updatedAt",
    orderDirection: params?.orderDirection || "desc",
  };

  if (params?.name) {
    queryParams.name = params.name;
  }

  const { data, isLoading } = useGetPartsQuery(queryParams);

  return {
    parts: data?.data || [],
    pagination: data?.pagination,
    isLoading,
  };
}

export function useCreatePart() {
  const [createPart, { isLoading }] = useCreatePartMutation();

  async function handleCreatePart(data: PartDto) {
    try {
      const response = await createPart(data).unwrap();

      toaster.create({
        title: "Peça cadastrada com sucesso!",
        description: `${response.name} foi adicionada à lista de peças.`,
        type: "success",
        duration: 5000,
      });

      return response;
    } catch (error) {
      toaster.create({
        title: "Erro ao cadastrar peça!",
        description: "Por favor, tente novamente.",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleCreatePart,
    isLoading,
  };
}

export function useUpdatePart() {
  const [updatePart, { isLoading }] = useUpdatePartMutation();

  async function handleUpdatePart(id: string, data: PartDto) {
    try {
      const response = await updatePart({ id, data }).unwrap();

      toaster.create({
        title: "Peça atualizada com sucesso!",
        description: `As informações de ${response.name} foram atualizadas.`,
        type: "success",
        duration: 5000,
      });

      return response;
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar peça!",
        description: "Por favor, tente novamente.",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleUpdatePart,
    isLoading,
  };
}

export function useDeletePart() {
  const [deletePart, { isLoading }] = useDeletePartMutation();

  async function handleDeletePart(id: string, name: string) {
    try {
      await deletePart(id).unwrap();

      toaster.create({
        title: "Peça excluída!",
        description: `${name} foi removida com sucesso.`,
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir peça!",
        description: "Por favor, tente novamente.",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleDeletePart,
    isLoading,
  };
}
