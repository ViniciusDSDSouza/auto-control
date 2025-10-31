import {
  useGetCarsQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} from "./api";
import { CarDto, GetCarsParams } from "./types";
import { toaster } from "@/src/components/ui/toaster";

export function useGetCars(params?: GetCarsParams) {
  const queryParams: GetCarsParams = {
    page: params?.page || 1,
    itemsPerPage: params?.itemsPerPage || 10,
    orderBy: params?.orderBy || "updatedAt",
    orderDirection: params?.orderDirection || "desc",
  };

  if (params?.brand) {
    queryParams.brand = params.brand;
  }

  if (params?.customerId) {
    queryParams.customerId = params.customerId;
  }

  const { data, isLoading } = useGetCarsQuery(queryParams);

  return {
    cars: data?.data || [],
    pagination: data?.pagination,
    isLoading,
  };
}

export function useCreateCar() {
  const [createCar, { isLoading }] = useCreateCarMutation();

  async function handleCreateCar(data: CarDto) {
    try {
      const response = await createCar(data).unwrap();

      toaster.create({
        title: "Carro cadastrado com sucesso!",
        description: `${response.brand} ${response.model} foi adicionado à lista de carros.`,
        type: "success",
        duration: 5000,
      });

      return response;
    } catch (error) {
      toaster.create({
        title: "Erro ao cadastrar carro!",
        description: "Por favor, tente novamente.",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleCreateCar,
    isLoading,
  };
}

export function useUpdateCar() {
  const [updateCar, { isLoading }] = useUpdateCarMutation();

  async function handleUpdateCar(id: string, data: CarDto) {
    try {
      const response = await updateCar({ id, data }).unwrap();

      toaster.create({
        title: "Carro atualizado com sucesso!",
        description: `As informações de ${response.brand} ${response.model} foram atualizadas.`,
        type: "success",
        duration: 5000,
      });

      return response;
    } catch (error) {
      toaster.create({
        title: "Erro ao atualizar carro!",
        description: "Por favor, tente novamente.",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleUpdateCar,
    isLoading,
  };
}

export function useDeleteCar() {
  const [deleteCar, { isLoading }] = useDeleteCarMutation();

  async function handleDeleteCar(id: string, brand: string, model: string) {
    try {
      await deleteCar(id).unwrap();

      toaster.create({
        title: "Carro excluído!",
        description: `${brand} ${model} foi removido com sucesso.`,
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: "Erro ao excluir carro!",
        description: "Por favor, tente novamente.",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  }

  return {
    handleDeleteCar,
    isLoading,
  };
}
