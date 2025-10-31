import { useState, useEffect } from "react";
import {
  useGetParts,
  useDeletePart,
  useCreatePart,
  useUpdatePart,
} from "@/src/modules/part/hooks";
import { Part } from "@/src/modules/part/types";
import { PartSchema } from "@/src/modules/part/schema";
import { GetPartsParams } from "@/src/modules/part/types";

export function usePartsGet() {
  const [params, setParams] = useState<GetPartsParams>({
    page: 1,
    itemsPerPage: 10,
    name: "",
    orderBy: "updatedAt",
    orderDirection: "desc",
  });

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({
        ...prev,
        name: searchInput,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { parts, pagination, isLoading: isLoadingParts } = useGetParts(params);

  const handleSearchChange = (searchValue: string) => {
    setSearchInput(searchValue);
  };

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

  const handleOrderChange = (
    orderBy: "name" | "model" | "price" | "updatedAt",
    orderDirection: "asc" | "desc"
  ) => {
    setParams((prev) => ({
      ...prev,
      orderBy,
      orderDirection,
      page: 1,
    }));
  };

  return {
    parts,
    pagination,
    isLoadingParts,
    params,
    searchInput,
    handleSearchChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleOrderChange,
  };
}

export function usePartsEdit() {
  const { handleCreatePart, isLoading: isCreating } = useCreatePart();
  const { handleUpdatePart, isLoading: isUpdating } = useUpdatePart();

  const [isPartDialogOpen, setIsPartDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);

  const handleOpenCreateDialog = () => {
    setEditingPart(null);
    setIsPartDialogOpen(true);
  };

  const handleOpenEditDialog = (part: Part) => {
    setEditingPart(part);
    setIsPartDialogOpen(true);
  };

  const handleClosePartDialog = () => {
    setIsPartDialogOpen(false);
    setEditingPart(null);
  };

  const handlePartSubmit = async (data: PartSchema) => {
    if (editingPart) {
      await handleUpdatePart(editingPart.id, data);
    } else {
      await handleCreatePart(data);
    }
  };

  return {
    isPartDialogOpen,
    editingPart,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleClosePartDialog,
    handlePartSubmit,
    isSavingPart: isCreating || isUpdating,
  };
}

export function usePartsDelete() {
  const { handleDeletePart } = useDeletePart();

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await handleDeletePart(deleteConfirm.id, deleteConfirm.name);
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
