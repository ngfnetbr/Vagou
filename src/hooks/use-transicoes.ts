import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Crianca } from "@/integrations/supabase/types";
import { fetchCriancas, apiMarcarDesistente, apiTransferirCrianca, apiMassRealocate, apiMarcarFimDeFila } from "@/integrations/supabase/criancas-api";
import { toast } from "sonner";
import { useMemo, useState, useEffect } from "react";
import { ConvocationData } from "@/integrations/supabase/types";

const TRANSICOES_QUERY_KEY = ["transicoes"];

export type StatusTransicao = 'Remanejamento Interno' | 'Fila Reclassificada' | 'Manter Status';

// Tipagem para o resultado da classificação, incluindo campos de planejamento
export interface CriancaClassificada extends Crianca {
    statusTransicao: StatusTransicao;
    
    // Campos de planejamento (null se não houver mudança planejada)
    planned_status?: Crianca['status'] | null;
    planned_cmei_id?: string | null;
    planned_turma_id?: string | null;
    planned_justificativa?: string | null;
}

// Função de classificação no frontend
const classifyCriancasForTransition = (criancas: Crianca[]): CriancaClassificada[] => {
    
    const activeCriancas = criancas.filter(c => 
        c.status === 'Matriculado' || 
        c.status === 'Matriculada' || 
        c.status === 'Fila de Espera' ||
        c.status === 'Convocado'
    );

    return activeCriancas.map(crianca => {
        let statusTransicao: StatusTransicao = 'Manter Status';

        // Classifica pelo status atual para determinar o grupo de ação
        if (crianca.status === 'Matriculado' || crianca.status === 'Matriculada') {
            statusTransicao = 'Remanejamento Interno';
        } else if (crianca.status === 'Fila de Espera' || crianca.status === 'Convocado') {
            statusTransicao = 'Fila Reclassificada';
        }

        return {
            ...crianca,
            statusTransicao,
            // Inicializa o planejamento com o status atual (sem mudanças)
            planned_status: crianca.status,
            planned_cmei_id: crianca.cmei_atual_id,
            planned_turma_id: crianca.turma_atual_id,
            planned_justificativa: null,
        } as CriancaClassificada;
    });
};

// --- Hook Principal ---

export function useTransicoes() {
    const queryClient = useQueryClient();
    
    const [planningData, setPlanningData] = useState<CriancaClassificada[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const { data: criancas, isLoading, error } = useQuery<Crianca[], Error>({
        queryKey: ["criancas"], 
        queryFn: fetchCriancas,
    });

    const initialClassification = useMemo(() => {
        if (!criancas) return [];
        return classifyCriancasForTransition(criancas);
    }, [criancas]);
    
    useEffect(() => {
        if (initialClassification.length > 0 && planningData.length === 0) {
            setPlanningData(initialClassification);
        }
    }, [initialClassification, planningData]);
    
    // --- Funções de Manipulação do Planejamento ---

    const updateCriancaInPlanning = (criancaId: string, updates: Partial<CriancaClassificada>) => {
        setPlanningData(prev => prev.map(c => 
            c.id === criancaId ? { ...c, ...updates } : c
        ));
    };

    const updateCriancaStatusInPlanning = (criancaId: string, newStatus: Crianca['status'], justificativa: string) => {
        updateCriancaInPlanning(criancaId, {
            planned_status: newStatus,
            planned_justificativa: justificativa,
            // Limpa vaga se o status for final
            planned_cmei_id: ['Desistente', 'Recusada', 'Fila de Espera'].includes(newStatus) ? null : undefined,
            planned_turma_id: ['Desistente', 'Recusada', 'Fila de Espera'].includes(newStatus) ? null : undefined,
        });
    };

    const updateCriancaVagaInPlanning = (criancaId: string, cmei_id: string, turma_id: string) => {
        updateCriancaInPlanning(criancaId, {
            planned_cmei_id: cmei_id,
            planned_turma_id: turma_id,
            // Garante que o status seja Matriculado se for realocação
            planned_status: 'Matriculado', 
            planned_justificativa: null,
        });
    };
    
    const massUpdateStatusInPlanning = (criancaIds: string[], newStatus: Crianca['status'], justificativa: string) => {
        setPlanningData(prev => prev.map(c => {
            if (criancaIds.includes(c.id)) {
                return {
                    ...c,
                    planned_status: newStatus,
                    planned_justificativa: justificativa,
                    planned_cmei_id: ['Desistente', 'Recusada', 'Fila de Espera'].includes(newStatus) ? null : c.planned_cmei_id,
                    planned_turma_id: ['Desistente', 'Recusada', 'Fila de Espera'].includes(newStatus) ? null : c.planned_turma_id,
                };
            }
            return c;
        }));
    };
    
    const massUpdateVagaInPlanning = (criancaIds: string[], cmei_id: string, turma_id: string) => {
        setPlanningData(prev => prev.map(c => {
            if (criancaIds.includes(c.id)) {
                return {
                    ...c,
                    planned_cmei_id: cmei_id,
                    planned_turma_id: turma_id,
                    planned_status: 'Matriculado',
                    planned_justificativa: null,
                };
            }
            return c;
        }));
    };

    // Simulação de salvamento do planejamento (apenas para feedback visual)
    const savePlanning = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success("Planejamento salvo com sucesso!", {
                description: `Ajustes foram armazenados.`,
            });
        } catch (e) {
            toast.error("Erro ao salvar planejamento.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Execução da Transição (Aplica as mudanças planejadas ao DB) ---
    const executeTransition = async () => {
        if (planningData.length === 0) {
            throw new Error("Nenhum dado de planejamento para aplicar.");
        }
        
        const changesToApply = planningData.filter(c => 
            c.planned_status !== c.status || 
            c.planned_cmei_id !== c.cmei_atual_id || 
            c.planned_turma_id !== c.turma_atual_id
        );
        
        if (changesToApply.length === 0) {
            toast.info("Nenhuma alteração detectada no planejamento.");
            return;
        }
        
        const promises: Promise<any>[] = [];
        
        for (const crianca of changesToApply) {
            const { id, planned_status, planned_cmei_id, planned_turma_id, planned_justificativa } = crianca;
            
            // 1. Mudança de Status (Desistente/Concluinte/Fila)
            if (planned_status !== crianca.status) {
                const justificativa = planned_justificativa || 'Ação de Transição Anual';
                
                if (planned_status === 'Desistente') {
                    promises.push(apiMarcarDesistente(id, justificativa));
                } else if (planned_status === 'Recusada') {
                    // Usamos Transferir (que marca como Desistente) para Concluintes/Evasão
                    promises.push(apiTransferirCrianca(id, justificativa)); 
                } else if (planned_status === 'Fila de Espera') {
                    // Reativação na fila (sem penalidade, pois é reclassificação)
                    promises.push(apiMarcarFimDeFila(id, justificativa)); // Usamos Fim de Fila para garantir reclassificação
                }
            } 
            
            // 2. Mudança de Vaga (Realocação)
            if (planned_cmei_id !== crianca.cmei_atual_id || planned_turma_id !== crianca.turma_atual_id) {
                if (planned_cmei_id && planned_turma_id) {
                    // Realocação
                    const data: ConvocationData = { cmei_id: planned_cmei_id, turma_id: planned_turma_id };
                    
                    // Se o status for 'Matriculado' e a vaga mudou, é Realocação.
                    if (planned_status === 'Matriculado' || planned_status === 'Matriculada') {
                        // Para a execução, vamos usar a função de realocação em massa com um único item
                        promises.push(apiMassRealocate({
                            criancaIds: [id],
                            cmei_id: planned_cmei_id,
                            turma_id: planned_turma_id,
                            cmeiNome: crianca.cmeiNome || 'CMEI', // Usamos o nome atual como fallback
                            turmaNome: crianca.turmaNome || 'Turma',
                        }));
                    }
                }
            }
        }
        
        // Executa todas as promessas em paralelo
        await Promise.all(promises);
    };

    const transitionMutation = useMutation({
        mutationFn: executeTransition,
        onSuccess: () => {
            setPlanningData([]);
            queryClient.invalidateQueries({ queryKey: ["criancas"] });
            queryClient.invalidateQueries({ queryKey: TRANSICOES_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['historicoGeral'] });
            toast.success(`Transição executada com sucesso!`, {
                description: `${planningData.filter(c => c.planned_status !== c.status || c.planned_cmei_id !== c.cmei_atual_id || c.planned_turma_id !== c.turma_atual_id).length} crianças foram atualizadas.`,
            });
        },
        onError: (e: Error) => {
            toast.error("Erro ao executar transição.", {
                description: e.message,
            });
        },
    });

    return {
        classificacao: planningData,
        isLoading: isLoading,
        error,
        savePlanning,
        isSaving,
        executeTransition: transitionMutation.mutateAsync,
        isExecuting: transitionMutation.isPending,
        
        // Funções de planejamento
        updateCriancaStatusInPlanning,
        updateCriancaVagaInPlanning,
        massUpdateStatusInPlanning,
        massUpdateVagaInPlanning,
    };
}