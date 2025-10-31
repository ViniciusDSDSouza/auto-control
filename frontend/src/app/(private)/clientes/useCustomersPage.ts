import { useState, useMemo } from "react";
import {
  useGetCustomers,
  useDeleteCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from "@/src/modules/customer/hooks";
import { Customer } from "@/src/modules/customer/types";
import { CustomerSchema } from "@/src/modules/customer/schema";

export function useCustomersPage() {
  const { customers, isLoading: isLoadingCustomers } = useGetCustomers();
  const { handleDeleteCustomer } = useDeleteCustomer();
  const { handleCreateCustomer, isLoading: isCreating } = useCreateCustomer();
  const { handleUpdateCustomer, isLoading: isUpdating } = useUpdateCustomer();
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
      ),
    [customers, search]
  );

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await handleDeleteCustomer(deleteConfirm.id, deleteConfirm.name);
      setDeleteConfirm(null);
    } catch {
      setDeleteConfirm(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirm(null);
  };

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
    customers: filteredCustomers,
    isLoadingCustomers,
    search,
    setSearch,
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCloseDeleteDialog,
    isCustomerDialogOpen,
    editingCustomer,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseCustomerDialog,
    handleCustomerSubmit,
    isSavingCustomer: isCreating || isUpdating,
  };
}
