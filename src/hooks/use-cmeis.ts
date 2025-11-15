import { useQuery } from "@tanstack/react-query";
import { fetchCmeis, fetchTurmasByCmei, Cmei, Turma } from "@/integrations/supabase/cmeis-api";

const CMEIS_QUERY_KEY = 'cmeis';
const TURMAS_QUERY_KEY = 'turmas';

export const useCmeis = () => {
    return useQuery<Cmei[], Error>({
        queryKey: [CMEIS_QUERY_KEY],
        queryFn: fetchCmeis,
    });
};

export const useTurmasByCmei = (cmeiId: string | undefined) => {
    return useQuery<Turma[], Error>({
        queryKey: [TURMAS_QUERY_KEY, cmeiId],
        queryFn: () => fetchTurmasByCmei(cmeiId!),
        enabled: !!cmeiId,
    });
};