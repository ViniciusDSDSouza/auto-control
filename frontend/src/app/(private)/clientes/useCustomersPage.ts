import { useState, useEffect } from "react";
import {
  useGetCustomers,
  useDeleteCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from "@/src/modules/customer/hooks";
import { Customer } from "@/src/modules/customer/types";
import { CustomerSchema } from "@/src/modules/customer/schema";
import { GetCustomersParams } from "@/src/modules/customer/types";

export function useCustomersGet() {
  const [params, setParams] = useState<GetCustomersParams>({
    page: 1,
    itemsPerPage: 10,
    name: "",
    phone: "",
    orderBy: "updatedAt",
    orderDirection: "desc",
  });

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({
        ...prev,
        name: searchInput,
        phone: searchInput,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    customers,
    pagination,
    isLoading: isLoadingCustomers,
  } = useGetCustomers(params);

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
    orderBy: "name" | "email" | "phone" | "updatedAt",
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
    customers,
    pagination,
    isLoadingCustomers,
    params,
    searchInput,
    handleSearchChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleOrderChange,
  };
}

export function useCustomersEdit() {
  const { handleCreateCustomer, isLoading: isCreating } = useCreateCustomer();
  const { handleUpdateCustomer, isLoading: isUpdating } = useUpdateCustomer();

  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleOpenCreateDialog = () => {
    setEditingCustomer(null);
    setIsCustomerDialogOpen(true);
  };

  const handleOpenEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerDialogOpen(true);
  };

  const handleCloseCustomerDialog = () => {
    setIsCustomerDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleCustomerSubmit = async (data: CustomerSchema) => {
    if (editingCustomer) {
      await handleUpdateCustomer(editingCustomer.id, data);
    } else {
      await handleCreateCustomer(data);
    }
  };

  return {
    isCustomerDialogOpen,
    editingCustomer,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseCustomerDialog,
    handleCustomerSubmit,
    isSavingCustomer: isCreating || isUpdating,
  };
}

export function useCustomersDelete() {
  const { handleDeleteCustomer } = useDeleteCustomer();

  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    displayName: string;
  } | null>(null);

  const handleDeleteClick = (
    id: string,
    name: string | undefined,
    phone: string | undefined
  ) => {
    const displayName = name || phone || "Cliente sem nome";
    setDeleteConfirm({ id, displayName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await handleDeleteCustomer(deleteConfirm.id, deleteConfirm.displayName);
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
