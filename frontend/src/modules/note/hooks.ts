import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "./api";
import { NoteDto, GetNotesParams } from "./types";
import { toaster } from "@/src/components/ui/toaster";

export function useGetNotes(params?: GetNotesParams) {
  const queryParams: GetNotesParams = {
    page: params?.page || 1,
    itemsPerPage: params?.itemsPerPage || 10,
    orderBy: params?.orderBy || "updatedAt",
    orderDirection: params?.orderDirection || "desc",
  };

  if (params?.customerId) {
    queryParams.customerId = params.customerId;
  }
  if (params?.carId) {
    queryParams.carId = params.carId;
  }
  if (params?.status) {
    queryParams.status = params.status;
  }
  if (params?.dateRangeFrom) {
    queryParams.dateRangeFrom = params.dateRangeFrom;
  }
  if (params?.dateRangeTo) {
    queryParams.dateRangeTo = params.dateRangeTo;
  }

  const { data, isLoading } = useGetNotesQuery(queryParams);

  return {
    notes: data?.data || [],
    pagination: data?.pagination,
    isLoading,
  };
}

export function useCreateNote() {
  const [createNote, { isLoading }] = useCreateNoteMutation();

  async function handleCreateNote(data: NoteDto) {
    try {
      const response = await createNote(data).unwrap();

      toaster.create({
        title: "Sucesso!",
        description: "Nota cadastrada com sucesso.",
        type: "success",
        duration: 5000,
      });

      return response;
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Erro desconhecido ao cadastrar nota";
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
    handleCreateNote,
    isLoading,
  };
}

export function useUpdateNote() {
  const [updateNote, { isLoading }] = useUpdateNoteMutation();

  async function handleUpdateNote(id: string, data: NoteDto) {
    try {
      const response = await updateNote({ id, data }).unwrap();

      toaster.create({
        title: "Sucesso!",
        description: "Nota atualizada com sucesso.",
        type: "success",
        duration: 5000,
      });

      return response;
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Erro desconhecido ao atualizar nota";
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
    handleUpdateNote,
    isLoading,
  };
}

export function useDeleteNote() {
  const [deleteNote, { isLoading }] = useDeleteNoteMutation();

  async function handleDeleteNote(id: string) {
    try {
      await deleteNote(id).unwrap();

      toaster.create({
        title: "Nota excluída!",
        description: "A nota foi removida com sucesso.",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Erro desconhecido ao excluir nota";
      toaster.create({
        title: "Erro ao excluir nota!",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleDeleteNote,
    isLoading,
  };
}
