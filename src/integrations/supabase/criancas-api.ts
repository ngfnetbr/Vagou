import { supabase } from "@/integrations/supabase/client";
import { Crianca, ConvocationData } from "./types";
import { insertHistoricoEntry } from "./historico-api";

// Helper para obter o nome do usuário logado (ou um placeholder)
const getAdminUser = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email || "Usuário Admin";
};

// --- Funções de Mutação ---

export const apiConfirmarMatricula = async (criancaId: string, cmeiNome: string, turmaNome: string) => {
    const user = await getAdminUser();
    
    const { error } = await supabase
        .from('criancas')
        .update({ 
            status: 'Matriculado',
            convocacao_deadline: null, // Limpa o prazo
        })
        .eq('id', criancaId)
        .select()
        .single();

    if (error) throw new Error(`Falha ao confirmar matrícula: ${error.message}`);
    
    await insertHistoricoEntry({
        crianca_id: criancaId,
        acao: "Matrícula Confirmada",
        detalhes: `Matrícula confirmada no CMEI ${cmeiNome} (Turma: ${turmaNome}).`,
        usuario: user,
    });
};

export const apiMarcarRecusada = async (criancaId: string, justificativa: string) => {
    const user = await getAdminUser();
    
    const { error } = await supabase
        .from('criancas')
        .update({ 
            status: 'Recusada',
            convocacao_deadline: null,
            cmei_atual_id: null,
            turma_atual_id: null,
        })
        .eq('id', criancaId);

    if (error) throw new Error(`Falha ao marcar como recusada: ${error.message}`);
    
    await insertHistoricoEntry({
        crianca_id: criancaId,
        acao: "Convocação Recusada",
        detalhes: `Convocação recusada. Justificativa: ${justificativa}`,
        usuario: user,
    });
};

export const apiMarcarDesistente = async (criancaId: string, justificativa: string) => {
    const user = await getAdminUser();
    
    const { error } = await supabase
        .from('criancas')
        .update({ 
            status: 'Desistente',
            convocacao_deadline: null,
            cmei_atual_id: null,
            turma_atual_id: null,
            posicao_fila: null,
        })
        .eq('id', criancaId);

    if (error) throw new Error(`Falha ao marcar como desistente: ${error.message}`);
    
    await insertHistoricoEntry({
        crianca_id: criancaId,
        acao: "Desistência Registrada",
        detalhes: `Criança marcada como Desistente. Justificativa: ${justificativa}`,
        usuario: user,
    });
};

export const apiMarcarFimDeFila = async (criancaId: string, justificativa: string) => {
    const user = await getAdminUser();
    
    // Define a data de penalidade para 6 meses no futuro
    const penalidadeDate = new Date();
    penalidadeDate.setMonth(penalidadeDate.getMonth() + 6);
    const penalidadeDateString = penalidadeDate.toISOString().split('T')[0];
    
    const { error } = await supabase
        .from('criancas')
        .update({ 
            status: 'Fila de Espera', // Volta para fila, mas com penalidade
            convocacao_deadline: null,
            cmei_atual_id: null,
            turma_atual_id: null,
            data_penalidade: penalidadeDateString, // Aplica a penalidade
        })
        .eq('id', criancaId);

    if (error) throw new Error(`Falha ao marcar fim de fila: ${error.message}`);
    
    await insertHistoricoEntry({
        crianca_id: criancaId,
        acao: "Fim de Fila Aplicado",
        detalhes: `Criança movida para o final da fila (penalidade até ${penalidadeDateString}). Justificativa: ${justificativa}`,
        usuario: user,
    });
};

export const apiReativarCrianca = async (criancaId: string) => {
    const user = await getAdminUser();
    
    const { error } = await supabase
        .from('criancas')
        .update({ 
            status: 'Fila de Espera',
            convocacao_deadline: null,
            cmei_atual_id: null,
            turma_atual_id: null,
            data_penalidade: null, // Remove qualquer penalidade
        })
        .eq('id', criancaId);

    if (error) throw new Error(`Falha ao reativar criança: ${error.message}`);
    
    await insertHistoricoEntry({
        crianca_id: criancaId,
        acao: "Reativação na Fila",
        detalhes: `Criança reativada na fila de espera.`,
        usuario: user,
    });
};

export const apiConvocarCrianca = async (criancaId: string, data: ConvocationData, cmeiNome: string, turmaNome: string, deadline: string) => {
    const user = await getAdminUser();
    
    const { error } = await supabase
        .from('criancas')
        .update({ 
            status: 'Convocado',
            cmei_atual_id: data.cmei_id,
            turma_atual_id: data.turma_id,
            convocacao_deadline: deadline,
            posicao_fila: null, // Sai da fila
        })
        .eq('id', criancaId);

    if (error) throw new Error(`Falha ao convocar criança: ${error.message}`);
    
    await insertHistoricoEntry({
        crianca_id: criancaId,
        acao: "Convocação Enviada",
        detalhes: `Convocada para o CMEI ${cmeiNome} (Turma: ${turmaNome}). Prazo: ${deadline}.`,
        usuario: user,
    });
};

export const apiDeleteCrianca = async (criancaId: string, criancaNome: string) => {
    const user = await getAdminUser();
    
    const { error } = await supabase
        .from('criancas')
        .delete()
        .eq('id', criancaId);

    if (error) throw new Error(`Falha ao excluir criança: ${error.message}`);
    
    await insertHistoricoEntry({
        crianca_id: criancaId,
        acao: "Criança Excluída",
        detalhes: `Registro da criança ${criancaNome} excluído permanentemente do sistema.`,
        usuario: user,
    });
};

// Funções de busca (assumindo que já existem ou serão criadas)
export const fetchCriancas = async (): Promise<Crianca[]> => {
    // Implementação de busca de lista de crianças
    return []; // Placeholder
};

export const fetchCriancaDetails = async (id: string): Promise<Crianca> => {
    // Implementação de busca de detalhes
    throw new Error("Not implemented"); // Placeholder
};