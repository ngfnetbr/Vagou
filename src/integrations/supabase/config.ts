import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";

// Função para buscar o prazo de resposta do DB
const fetchPrazoResposta = async (): Promise<number> => {
    const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('prazo_resposta_dias')
        .eq('id', 1)
        .single();
        
    if (error) {
        console.error("Erro ao buscar prazo de resposta:", error);
        return 7; // Fallback para 7 dias
    }
    return data.prazo_resposta_dias || 7;
};

// Função para calcular o deadline (usando o prazo do DB)
export const calculateDeadline = async (): Promise<string> => {
    const prazoDias = await fetchPrazoResposta();
    const today = new Date();
    
    // Adiciona o número de dias configurado
    const deadlineDate = addDays(today, prazoDias);
    
    // Retorna no formato YYYY-MM-DD
    return format(deadlineDate, 'yyyy-MM-dd');
};