import { supabase } from "@/integrations/supabase/client";
import { HistoricoEntry } from "./types";

// Define a estrutura mínima para inserção
interface NewHistoricoEntry {
    crianca_id: string;
    acao: string;
    detalhes: string;
    usuario: string; // Quem realizou a ação (e.g., nome do usuário logado ou 'Sistema')
}

// Função para inserir um novo registro no histórico
export const insertHistoricoEntry = async (entry: NewHistoricoEntry) => {
    // A coluna 'data' (date only) e 'created_at' (timestamp) são preenchidas automaticamente pelo DB
    const { error } = await supabase
        .from('historico')
        .insert({
            crianca_id: entry.crianca_id,
            acao: entry.acao,
            detalhes: entry.detalhes,
            usuario: entry.usuario,
        });

    if (error) {
        console.error("Erro ao registrar histórico:", error);
        // Não lançamos erro aqui para não interromper a operação principal, mas registramos.
    }
};


// Busca o histórico real da criança
export const fetchHistoricoCrianca = async (criancaId: string): Promise<HistoricoEntry[]> => {
    const { data, error } = await supabase
        .from('historico')
        .select('data, acao, detalhes, usuario, created_at') // Incluindo created_at
        .eq('crianca_id', criancaId)
        .order('created_at', { ascending: false }); // Ordena pelo timestamp completo
        
    if (error) {
        console.error("Erro ao buscar histórico:", error);
        return [];
    }
    
    // Mapeia a estrutura do DB para HistoricoEntry
    return data.map(h => ({
        data: h.data,
        acao: h.acao,
        detalhes: h.detalhes,
        usuario: h.usuario,
        created_at: h.created_at, // Mapeando created_at
    }));
};

// Busca o histórico geral do sistema
export const fetchHistoricoGeral = async (): Promise<HistoricoEntry[]> => {
    const { data, error } = await supabase
        .from('historico')
        .select('data, acao, detalhes, usuario, created_at') // Incluindo created_at
        .order('created_at', { ascending: false }); // Ordena pelo timestamp completo

    if (error) {
        throw new Error(error.message);
    }
    
    // Mapeia a estrutura do DB para HistoricoEntry
    return data.map(h => ({
        data: h.data,
        acao: h.acao,
        detalhes: h.detalhes,
        usuario: h.usuario,
        created_at: h.created_at, // Mapeando created_at
    }));
};