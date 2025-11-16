import { useQuery } from "@tanstack/react-query";
import { fetchAllTurmasByCmei } from "@/integrations/supabase/turmas-api";

const ALL_TURMAS_BY_CMEI_QUERY_KEY = 'allTurmasByCmei';

export interface TurmaDetalhe {
    cmei: string;
    turma: string;
    vagas: number;
    capacidade: number;
    ocupacao: number;
    cmei_id: string;
    turma_id: string;
}

export const useAllTurmasByCmei = (cmeiId: string | undefined) => {
    return useQuery<TurmaDetalhe[], Error>({
        queryKey: [ALL_TURMAS_BY_CMEI_QUERY_KEY, cmeiId],
        queryFn: () => fetchAllTurmasByCmei(cmeiId!),
        enabled: !!cmeiId,
    });
};