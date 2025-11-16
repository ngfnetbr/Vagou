import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Crianca } from "@/integrations/supabase/types";
import { fetchCriancas } from "@/integrations/supabase/criancas-api";
import { calculateAgeAtCutoff, determineTurmaBaseName } from "@/integrations/supabase/utils";
import { toast } from "sonner";
import { useMemo } from "react";

const TRANSICOES_QUERY_KEY = ["transicoes"];

// Tipagem para o resultado da classificação
export interface CriancaClassificada extends Crianca {
    idadeCorte: number | null;
    turmaBaseAtual: string;
    turmaBaseProximoAno: string;
    statusTransicao: 'Concluinte' | 'Remanejamento Interno' | 'Fila Reclassificada' | 'Manter Status';
}

// Função de classificação no frontend
const classifyCriancasForTransition = (criancas: Crianca[], targetYear: number): CriancaClassificada[] => {
    const activeCriancas = criancas.filter(c => 
        c.status === 'Matriculado' || 
        c.status === 'Matriculada' || 
        c.status === 'Fila de Espera' ||
        c.status === 'Convocado'
    );

    return activeCriancas.map(crianca => {
        // Calcula a idade na data de corte do próximo ano
        const idadeCorte = calculateAgeAtCutoff(crianca.data_nascimento, targetYear);
        const turmaBaseProximoAno = determineTurmaBaseName(idadeCorte);
        
        // Determina a turma base atual (usando o ano atual para comparação)
        const idadeCorteAtual = calculateAgeAtCutoff(crianca.data_nascimento, new Date().getFullYear());
        const turmaBaseAtual = determineTurmaBaseName(idadeCorteAtual);

        let statusTransicao: CriancaClassificada['statusTransicao'] = 'Manter Status';

        if (turmaBaseProximoAno === 'Fora da faixa etária') {
            // Assumimos que "Fora da faixa etária" (4 anos ou mais na data de corte) significa que a criança concluiu o CMEI.
            statusTransicao = 'Concluinte';
        } else if (crianca.status === 'Matriculado' || crianca.status === 'Matriculada') {
            // Se está matriculado e não é concluinte, é remanejamento interno
            statusTransicao = 'Remanejamento Interno';
        } else if (crianca.status === 'Fila de Espera' || crianca.status === 'Convocado') {
            // Se está na fila ou convocado, precisa ser reclassificado na fila
            statusTransicao = 'Fila Reclassificada';
        }

        return {
            ...crianca,
            idadeCorte,
            turmaBaseAtual,
            turmaBaseProximoAno,
            statusTransicao,
        };
    });
};

// --- Hook Principal ---

export function useTransicoes(targetYear: number) {
    const queryClient = useQueryClient();

    // Reutiliza a query de todas as crianças ativas
    const { data: criancas, isLoading, error } = useQuery<Crianca[], Error>({
        queryKey: ["criancas"], 
        queryFn: fetchCriancas,
    });

    const classificacao = useMemo(() => {
        if (!criancas) return [];
        return classifyCriancasForTransition(criancas, targetYear);
    }, [criancas, targetYear]);
    
    // Mock de mutação para executar a transição em massa
    const executeTransition = async (data: CriancaClassificada[]) => {
        // Simulação de API call para executar a transição no backend
        console.log(`Executando transição para o ano ${targetYear}. Total de ${data.length} crianças.`);
        
        // Em um ambiente real, esta função chamaria uma Edge Function ou RPC no Supabase
        // para executar as mutações em massa (atualizar status, limpar cmei/turma, etc.)
        
        // Mock de sucesso
        return new Promise(resolve => setTimeout(resolve, 1500));
    };

    const transitionMutation = useMutation({
        mutationFn: executeTransition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["criancas"] });
            queryClient.invalidateQueries({ queryKey: TRANSICOES_QUERY_KEY });
            toast.success(`Transição para ${targetYear} executada com sucesso!`, {
                description: "Os status e classificações das crianças foram atualizados (Simulação).",
            });
        },
        onError: (e: Error) => {
            toast.error("Erro ao executar transição.", {
                description: e.message,
            });
        },
    });

    return {
        classificacao,
        isLoading: isLoading || transitionMutation.isPending,
        error,
        executeTransition: transitionMutation.mutateAsync,
        isExecuting: transitionMutation.isPending,
    };
}