import { useState, useEffect } from "react";
import {
  useGetCars,
  useDeleteCar,
  useCreateCar,
  useUpdateCar,
} from "@/src/modules/car/hooks";
import { Car } from "@/src/modules/car/types";
import { CarSchema } from "@/src/modules/car/schema";
import { GetCarsParams } from "@/src/modules/car/types";

export function useCarsGet() {
  const [params, setParams] = useState<GetCarsParams>({
    page: 1,
    itemsPerPage: 10,
    brand: "",
    orderBy: "updatedAt",
    orderDirection: "desc",
  });

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({
        ...prev,
        brand: searchInput,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { cars, pagination, isLoading: isLoadingCars } = useGetCars(params);

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
    orderBy: "brand" | "model" | "year" | "updatedAt",
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
    cars,
    pagination,
    isLoadingCars,
    params,
    searchInput,
    handleSearchChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleOrderChange,
  };
}

export function useCarsEdit() {
  const { handleCreateCar, isLoading: isCreating } = useCreateCar();
  const { handleUpdateCar, isLoading: isUpdating } = useUpdateCar();

  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const handleOpenCreateDialog = () => {
    setEditingCar(null);
    setIsCarDialogOpen(true);
  };

  const handleOpenEditDialog = (car: Car) => {
    setEditingCar(car);
    setIsCarDialogOpen(true);
  };

  const handleCloseCarDialog = () => {
    setIsCarDialogOpen(false);
    setEditingCar(null);
  };

  const handleCarSubmit = async (data: CarSchema) => {
    if (editingCar) {
      await handleUpdateCar(editingCar.id, data);
    } else {
      await handleCreateCar(data);
    }
  };

  return {
    isCarDialogOpen,
    editingCar,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseCarDialog,
    handleCarSubmit,
    isSavingCar: isCreating || isUpdating,
  };
}

export function useCarsDelete() {
  const { handleDeleteCar } = useDeleteCar();

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    brand: string;
    model: string;
  } | null>(null);

  const handleDeleteClick = (id: string, brand: string, model: string) => {
    setDeleteConfirm({ id, brand, model });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await handleDeleteCar(
        deleteConfirm.id,
        deleteConfirm.brand,
        deleteConfirm.model
      );
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
