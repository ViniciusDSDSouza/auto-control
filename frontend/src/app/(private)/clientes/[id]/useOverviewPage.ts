import { useGetCustomerByIdQuery } from "@/src/modules/customer/api";

export function useOverviewPage(id: string) {
  const { data: customer, isLoading: isLoadingCustomer } =
    useGetCustomerByIdQuery(id);

  return {
    customer,
    isLoadingCustomer,
    notes: customer?.notes || [],
    cars: customer?.cars || [],
  };
}
