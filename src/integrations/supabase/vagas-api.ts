import { supabase } from "@/integrations/supabase/client";
import { getCriancaById } from "./criancas-api";

export const fetchAvailableTurmas = async (criancaId: string): Promise<{ cmei: string, turma: string, vagas: number, cmei_id: string, turma_id: string }[]> => {
    // 1. Buscar a criança para obter preferências
    const crianca = await getCriancaById(criancaId);
    if (!crianca) return [];

    // 2. Buscar todas as turmas disponíveis (com JOIN para CMEI e Turma Base)
    const { data: turmasDb, error: turmasError } = await supabase
        .from('turmas')
        .select(`
            id,
            cmei_id,
            capacidade,
            ocupacao,
            nome,
            turma_base_id,
            cmeis (nome),
            turmas_base (idade_minima_meses, idade_maxima_meses)
        `)
        .gt('capacidade', 0); // Filtra apenas turmas com capacidade > 0

    if (turmasError) {
        console.error("Erro ao buscar turmas disponíveis:", turmasError);
        return [];
    }
    
    // 3. Filtrar por compatibilidade de idade (usando data_nascimento da criança)
    const dob = new Date(crianca.data_nascimento + 'T00:00:00');
    const today = new Date();
    const ageInMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());

    let availableTurmas = turmasDb
        .filter(t => t.capacidade > t.ocupacao) // Deve ter vagas
        .filter(t => {
            const base = (t.turmas_base as any) as { idade_minima_meses: number, idade_maxima_meses: number };
            return ageInMonths >= base.idade_minima_meses && ageInMonths <= base.idade_maxima_meses;
        })
        .map(t => ({
            cmei: ((t.cmeis as any) as { nome: string }).nome,
            turma: t.nome,
            vagas: t.capacidade - t.ocupacao,
            cmei_id: t.cmei_id,
            turma_id: t.id,
        }));

    const preferredCmeis = [crianca.cmei1_preferencia, crianca.cmei2_preferencia].filter(Boolean);
    
    if (!crianca.aceita_qualquer_cmei) {
        // Se não aceita qualquer CMEI, filtra apenas os preferidos
        availableTurmas = availableTurmas.filter(turma => preferredCmeis.includes(turma.cmei));
    } else {
        // Prioriza CMEIs preferidos
        availableTurmas.sort((a, b) => {
            const aPreferred = preferredCmeis.includes(a.cmei);
            const bPreferred = preferredCmeis.includes(b.cmei);
            
            if (aPreferred && !bPreferred) return -1;
            if (!aPreferred && bPreferred) return 1;
            return 0;
        });
    }

    return availableTurmas;
};