import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCriancas, addCriancaFromInscricao, InscricaoFormData, Crianca } from "@/lib/mock-data";
import { toast } from "sonner";

const CRIANCAS_QUERY_KEY = ["criancas"];

export function useCriancas() {
  const queryClient = useQueryClient();

  const { data: criancas, isLoading, error } = useQuery<Crianca[]>({
    queryKey: CRIANCAS_QUERY_KEY,
    queryFn: fetchCriancas,
  });

  const addMutation = useMutation({
    mutationFn: addCriancaFromInscricao,
    onSuccess: (newCrianca) => {
      queryClient.setQueryData<Crianca[]>(CRIANCAS_QUERY_KEY, (old) => {
        if (old) {
          return [...old, newCrianca];
        }
        return [newCrianca];
      });
      toast.success("Criança cadastrada com sucesso!", {
        description: `A criança ${newCrianca.nome} foi adicionada à ${newCrianca.status}.`,
      });
    },
    onError: () => {
      toast.error("Erro ao cadastrar criança.", {
        description: "Tente novamente mais tarde.",
      });
    },
  });

  // Placeholder for other mutations (update, delete) if needed later

  return {
    criancas: criancas || [],
    isLoading,
    error,
    addCrianca: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
}