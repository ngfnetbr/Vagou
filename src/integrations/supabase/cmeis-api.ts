import { supabase } from "@/integrations/supabase/client";

export interface Cmei {
    id: string;
    nome: string;
    capacidade: number;
    ocupacao: number;
}

export interface Turma {
    id: string;
    cmei_id: string;
    nome: string;
    sala: string;
    capacidade: number;
    ocupacao: number;
    turma_base_id: number;
}

export const fetchCmeis = async (): Promise<Cmei[]> => {
    const { data, error } = await supabase
        .from('cmeis')
        .select('id, nome, capacidade, ocupacao')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro ao buscar CMEIs:", error);
        throw new Error(error.message);
    }
    return data;
};

export const fetchTurmasByCmei = async (cmeiId: string): Promise<Turma[]> => {
    const { data, error } = await supabase
        .from('turmas')
        .select('id, cmei_id, nome, sala, capacidade, ocupacao, turma_base_id')
        .eq('cmei_id', cmeiId)
        .order('nome', { ascending: true });

    if (error) {
        console.error(`Erro ao buscar turmas para CMEI ${cmeiId}:`, error);
        throw new Error(error.message);
    }
    return data;
};