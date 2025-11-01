import { useState } from "react";
import {
  useGetNotes,
  useDeleteNote,
  useCreateNote,
  useUpdateNote,
} from "@/src/modules/note/hooks";
import { Note } from "@/src/modules/note/types";
import { NoteSchema } from "@/src/modules/note/schema";
import { GetNotesParams } from "@/src/modules/note/types";

export function useNotesGet() {
  const [params, setParams] = useState<GetNotesParams>({
    page: 1,
    itemsPerPage: 10,
    orderBy: "updatedAt",
    orderDirection: "desc",
  });

  const { notes, pagination, isLoading: isLoadingNotes } = useGetNotes(params);

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setParams((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      page: 1,
    }));
  };

  const handleDateRangeChange = (
    dateRangeFrom?: string,
    dateRangeTo?: string
  ) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      dateRangeFrom,
      dateRangeTo,
    }));
  };

  return {
    notes,
    pagination,
    isLoadingNotes,
    params,
    handlePageChange,
    handleItemsPerPageChange,
    handleDateRangeChange,
  };
}

export function useNotesEdit() {
  const { handleCreateNote, isLoading: isCreating } = useCreateNote();
  const { handleUpdateNote, isLoading: isUpdating } = useUpdateNote();

  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleOpenCreateDialog = () => {
    setEditingNote(null);
    setIsNoteDialogOpen(true);
  };

  const handleOpenEditDialog = (note: Note) => {
    setEditingNote(note);
    setIsNoteDialogOpen(true);
  };

  const handleCloseNoteDialog = () => {
    setIsNoteDialogOpen(false);
    setEditingNote(null);
  };

  const handleNoteSubmit = async (data: NoteSchema) => {
    const partsPrice =
      data.parts?.reduce((sum, part) => sum + part.price * part.quantity, 0) ||
      0;
    const totalPrice = data.laborPrice + partsPrice;

    const noteDto = {
      customerId: data.customerId,
      carId: data.carId,
      laborPrice: data.laborPrice,
      partsPrice,
      totalPrice,
      status: data.status,
      parts: data.parts?.map((p) => ({
        partId: p.partId,
        quantity: p.quantity,
        price: p.price,
      })),
    };

    if (editingNote) {
      await handleUpdateNote(editingNote.id, noteDto);
    } else {
      await handleCreateNote(noteDto);
    }
  };

  return {
    isNoteDialogOpen,
    editingNote,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseNoteDialog,
    handleNoteSubmit,
    isSavingNote: isCreating || isUpdating,
  };
}

export function useNotesDelete() {
  const { handleDeleteNote } = useDeleteNote();

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
  } | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await handleDeleteNote(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch {
      setDeleteConfirm(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirm(null);
  };

  return {
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCloseDeleteDialog,
  };
}
