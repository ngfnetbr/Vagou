import { useQuery } from "@tanstack/react-query";
import { useCMEIs, Turma } from "./use-cmeis";
import { useTurmas } from "./use-turmas";
import { useCriancas } from "./use-criancas";
import { Crianca } from "@/integrations/supabase/types";
import { useMemo } from "react";

// Tipagem para o agrupamento de dados
interface TurmaGroup {
    id: string;
    nomeCompleto: string;
    cmeiNome: string;
    capacidade: number;
    ocupacao: number;
    alunos: Crianca[];
}

interface RemanejamentoData {
    turmas: TurmaGroup[];
    fila: Crianca[];
    isLoading: boolean;
    error: Error | null;
}

export function useRemanejamentoData(): RemanejamentoData {
    const { cmeis, isLoading: isLoadingCmeis, error: errorCmeis } = useCMEIs();
    const { turmas, isLoading: isLoadingTurmas, error: errorTurmas } = useTurmas();
    const { criancas, isLoading: isLoadingCriancas, error: errorCriancas } = useCriancas();

    const isLoading = isLoadingCmeis || isLoadingTurmas || isLoadingCriancas;
    const error = errorCmeis || errorTurmas || errorCriancas;

    const { turmasAgrupadas, filaDeEspera } = useMemo(() => {
        if (isLoading || error || !cmeis || !turmas || !criancas) {
            return { turmasAgrupadas: [], filaDeEspera: [] };
        }

        const cmeiMap = new Map(cmeis.map(c => [c.id, c.nome]));
        const turmaMap = new Map(turmas.map(t => [t.id, t]));
        
        const turmasGroups: Record<string, TurmaGroup> = {};
        const fila: Crianca[] = [];

        // Inicializa os grupos de turmas
        turmas.forEach(t => {
            turmasGroups[t.id] = {
                id: t.id,
                nomeCompleto: t.nome,
                cmeiNome: cmeiMap.get(t.cmei_id) || 'CMEI Desconhecido',
                capacidade: t.capacidade,
                ocupacao: t.ocupacao,
                alunos: [],
            };
        });

        // Distribui as crianças
        criancas.forEach(c => {
            if (c.status === 'Matriculado' || c.status === 'Matriculada' || c.status === 'Remanejamento Solicitado' || c.status === 'Convocado') {
                if (c.turma_atual_id && turmasGroups[c.turma_atual_id]) {
                    turmasGroups[c.turma_atual_id].alunos.push(c);
                }
            } else if (c.status === 'Fila de Espera') {
                fila.push(c);
            }
        });
        
        // Ordena a fila pela posição
        fila.sort((a, b) => (a.posicao_fila || Infinity) - (b.posicao_fila || Infinity));

        return {
            turmasAgrupadas: Object.values(turmasGroups).filter(t => t.alunos.length > 0 || t.capacidade > 0),
            filaDeEspera: fila,
        };
    }, [cmeis, turmas, criancas, isLoading, error]);

    return {
        turmas: turmasAgrupadas,
        fila: filaDeEspera,
        isLoading,
        error: error as Error | null,
    };
}