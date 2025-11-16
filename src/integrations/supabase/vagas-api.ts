import { supabase } from "@/integrations/supabase/client";
import { getCriancaById } from "./criancas-api";
import { calculateAgeAtCutoff, determineTurmaBaseName } from "./utils"; // Importando as novas funções

export const fetchAvailableTurmas = async (criancaId: string): Promise<{ cmei: string, turma: string, vagas: number, cmei_id: string, turma_id: string }[]> => {
    // 1. Buscar a criança para obter preferências e data de nascimento
    const crianca = await getCriancaById(criancaId);
    if (!crianca) return [];

    // 2. Calcular a idade na data de corte e determinar a Turma Base compatível
    const ageAtCutoff = calculateAgeAtCutoff(crianca.data_nascimento);
    const requiredTurmaBaseName = determineTurmaBaseName(ageAtCutoff);
    
    // Se a criança for muito nova (menos de 6 meses) ou fora da faixa etária, não há vagas compatíveis.
    // A lógica de 6 meses é tratada no frontend (CriancaDataForm), mas aqui garantimos que a classificação seja válida.
    if (requiredTurmaBaseName === "Data de Nascimento Inválida" || requiredTurmaBaseName === "Fora da faixa etária") {
        return [];
    }
    
    // 3. Buscar o ID da Turma Base correspondente ao nome determinado
    const { data: baseTurmaData, error: baseTurmaError } = await supabase
        .from('turmas_base')
        .select('id')
        .eq('nome', requiredTurmaBaseName)
        .single();
        
    if (baseTurmaError || !baseTurmaData) {
        console.error(`Turma Base não encontrada para: ${requiredTurmaBaseName}`, baseTurmaError);
        return [];
    }
    
    const requiredTurmaBaseId = baseTurmaData.id;

    // 4. Buscar todas as turmas disponíveis que correspondem ao requiredTurmaBaseId
    const { data: turmasDb, error: turmasError } = await supabase
        .from('turmas')
        .select(`
            id,
            cmei_id,
            capacidade,
            ocupacao,
            nome,
            turma_base_id,
            cmeis (nome)
        `)
        .eq('turma_base_id', requiredTurmaBaseId) // Filtra pela Turma Base compatível
        .gt('capacidade', 0); // Filtra apenas turmas com capacidade > 0

    if (turmasError) {
        console.error("Erro ao buscar turmas disponíveis:", turmasError);
        return [];
    }
    
    // 5. Mapear e filtrar por vagas disponíveis e preferências
    let availableTurmas = turmasDb
        .filter(t => t.capacidade > t.ocupacao) // Deve ter vagas
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