import { useQuery } from "@tanstack/react-query";
import { HistoricoEntry } from "@/integrations/supabase/types"; // Corrigido o caminho de importação
import { fetchHistoricoGeral } from "@/integrations/supabase/historico-api"; // Importação atualizada

const HISTORICO_QUERY_KEY = ["historicoGeral"];

export function useHistoricoGeral() {
  const { data: logs, isLoading, error } = useQuery<HistoricoEntry[]>({
    queryKey: HISTORICO_QUERY_KEY,
    queryFn: fetchHistoricoGeral,
  });

  return {
    logs: logs || [],
    isLoading,
    error,
  };
}