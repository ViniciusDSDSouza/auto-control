import { useState, useMemo } from "react";
import {
  useGetCustomers,
  useDeleteCustomer,
  useCreateCustomer,
  useUpdateCustomer,
} from "@/src/modules/customer/hooks";

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

  return {
    customers: filteredCustomers,
    isLoadingCustomers,
    search,
    setSearch,
    deleteConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleCloseDeleteDialog,
  };
}
