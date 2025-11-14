import { supabase } from "@/integrations/supabase/client";
import { InscricaoFormData } from "@/lib/schemas/inscricao-schema";

// --- Tipagem de Dados ---

export interface HistoricoEntry {
  data: string; // YYYY-MM-DD
  acao: string;
  detalhes: string;
  usuario: string;
}

// Tipagem da tabela 'criancas' no Supabase
export interface Crianca {
  id: string; // UUID
  nome: string;
  data_nascimento: string; // YYYY-MM-DD format
  sexo: "feminino" | "masculino";
  programas_sociais: boolean; // Mapeado de 'sim'/'nao' para boolean
  aceita_qualquer_cmei: boolean; // Mapeado de 'sim'/'nao' para boolean
  cmei1_preferencia: string;
  cmei2_preferencia?: string;
  responsavel_nome: string;
  responsavel_cpf: string;
  responsavel_telefone: string;
  responsavel_email?: string;
  endereco?: string;
  bairro?: string;
  observacoes?: string;
  status: "Matriculada" | "Matriculado" | "Fila de Espera" | "Convocado" | "Desistente" | "Recusada" | "Remanejamento Solicitado";
  cmei_atual_id?: string; // UUID do CMEI atual (se matriculado/convocado)
  turma_atual_id?: string; // UUID da Turma atual (se matriculado/convocado)
  posicao_fila?: number;
  convocacao_deadline?: string; // YYYY-MM-DD for conviction deadline
  created_at: string;
  
  // Campos calculados/relacionados (não vêm diretamente do DB, mas são úteis no frontend)
  idade: string; // Calculado
  cmeiNome?: string; // Nome do CMEI atual
  turmaNome?: string; // Nome da Turma atual
}

// --- Helper Functions ---

// Helper function to calculate age string (years, months, days)
const calculateAgeString = (dobString: string): string => {
  const today = new Date();
  const dob = new Date(dobString + 'T00:00:00');
  
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    // Get the number of days in the previous month
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ano(s)`);
  if (months > 0) parts.push(`${months} meses`);
  if (days > 0 || parts.length === 0) { // Always show days if no years/months, or if days > 0
    parts.push(`${days} dia(s)`);
  }

  if (parts.length === 0) return "Recém-nascido";
  
  // Format: "1 ano(s), 6 meses e 10 dia(s)"
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(' e ');
  
  const last = parts.pop();
  return `${parts.join(', ')} e ${last}`;
};

// Mapeia o formato do DB para o formato do Frontend (Crianca)
const mapDbToCrianca = (dbData: any): Crianca => {
    return {
        id: dbData.id,
        nome: dbData.nome,
        data_nascimento: dbData.data_nascimento,
        sexo: dbData.sexo,
        programas_sociais: dbData.programas_sociais,
        aceita_qualquer_cmei: dbData.aceita_qualquer_cmei,
        cmei1_preferencia: dbData.cmei1_preferencia,
        cmei2_preferencia: dbData.cmei2_preferencia,
        responsavel_nome: dbData.responsavel_nome,
        responsavel_cpf: dbData.responsavel_cpf,
        responsavel_telefone: dbData.responsavel_telefone,
        responsavel_email: dbData.responsavel_email,
        endereco: dbData.endereco,
        bairro: dbData.bairro,
        observacoes: dbData.observacoes,
        status: dbData.status,
        cmei_atual_id: dbData.cmei_atual_id,
        turma_atual_id: dbData.turma_atual_id,
        posicao_fila: dbData.posicao_fila,
        convocacao_deadline: dbData.convocacao_deadline,
        created_at: dbData.created_at,
        
        // Campos calculados
        idade: calculateAgeString(dbData.data_nascimento),
        cmeiNome: dbData.cmeis?.nome, // Assume que o JOIN 'cmeis' está disponível
        turmaNome: dbData.turmas?.nome, // Assume que o JOIN 'turmas' está disponível
    };
};

// Mapeia o formato do Formulário (InscricaoFormData) para o formato do DB
const mapFormToDb = (data: InscricaoFormData) => {
    return {
        nome: data.nomeCrianca,
        data_nascimento: data.dataNascimento,
        sexo: data.sexo,
        programas_sociais: data.programasSociais === 'sim',
        aceita_qualquer_cmei: data.aceitaQualquerCmei === 'sim',
        cmei1_preferencia: data.cmei1,
        cmei2_preferencia: data.cmei2 || null,
        responsavel_nome: data.nomeResponsavel,
        responsavel_cpf: data.cpf,
        responsavel_telefone: data.telefone,
        responsavel_email: data.email || null,
        endereco: data.endereco || null,
        bairro: data.bairro || null,
        observacoes: data.observacoes || null,
        
        // Campos de status inicial
        status: "Fila de Espera",
        cmei_atual_id: null,
        turma_atual_id: null,
        posicao_fila: null, // Será gerenciado por uma função de fila ou trigger
        convocacao_deadline: null,
    };
};

// --- Funções de API (Supabase) ---

export const fetchCriancas = async (): Promise<Crianca[]> => {
  // Em um sistema real, faríamos um JOIN para buscar os nomes de CMEI e Turma.
  // Por enquanto, faremos um SELECT simples e deixaremos o mapeamento de nomes para o frontend,
  // mas vamos buscar os dados de CMEI e Turma para preencher cmeiNome e turmaNome.
  const { data, error } = await supabase
    .from('criancas')
    .select(`
        *,
        cmeis (nome),
        turmas (nome)
    `)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  
  // Mapeia os dados do DB para o formato Crianca do frontend
  return data.map(mapDbToCrianca);
};

export const getCriancaById = async (id: string): Promise<Crianca | undefined> => {
    const { data, error } = await supabase
        .from('criancas')
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
        throw new Error(error.message);
    }
    
    if (!data) return undefined;
    
    return mapDbToCrianca(data);
};

export const addCriancaFromInscricao = async (data: InscricaoFormData): Promise<Crianca> => {
  const payload = mapFormToDb(data);
  
  // TODO: Implementar lógica de atribuição de posição na fila (posicao_fila)
  // Por enquanto, inserimos com posicao_fila = null.
  
  const { data: newCriancaDb, error } = await supabase
    .from('criancas')
    .insert([payload])
    .select(`
        *,
        cmeis (nome),
        turmas (nome)
    `)
    .single();

  if (error) {
    throw new Error(`Erro ao cadastrar criança: ${error.message}`);
  }
  
  return mapDbToCrianca(newCriancaDb);
};

export const updateCrianca = async (id: string, data: InscricaoFormData): Promise<Crianca> => {
    const payload = mapFormToDb(data);
    
    // Remove campos de status inicial para não sobrescrever o status atual
    delete payload.status;
    delete payload.cmei_atual_id;
    delete payload.turma_atual_id;
    delete payload.posicao_fila;
    delete payload.convocacao_deadline;

    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update(payload)
        .eq('id', id)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao atualizar criança: ${error.message}`);
    }
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const deleteCrianca = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('criancas')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Erro ao excluir criança: ${error.message}`);
    }
};

// --- Funções de Mutação de Status (Ações Administrativas) ---

export interface ConvocationData {
    cmei_id: string;
    turma_id: string;
}

// Função para calcular o deadline (7 dias úteis)
const calculateDeadline = (): string => {
    const today = new Date();
    let deadline = new Date(today);
    
    // Simulação simples: 7 dias + 2 dias de fim de semana = 9 dias
    deadline.setDate(deadline.getDate() + 9); 
    
    return deadline.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const convocarCrianca = async (criancaId: string, data: ConvocationData): Promise<Crianca> => {
    const deadline = calculateDeadline();
    
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            status: "Convocado",
            cmei_atual_id: data.cmei_id,
            turma_atual_id: data.turma_id,
            posicao_fila: null,
            convocacao_deadline: deadline,
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao convocar criança: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const confirmarMatricula = async (criancaId: string): Promise<Crianca> => {
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            status: "Matriculado", // Simplificando para 'Matriculado'
            posicao_fila: null,
            convocacao_deadline: null,
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao confirmar matrícula: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const marcarRecusada = async (criancaId: string, justificativa: string): Promise<Crianca> => {
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            status: "Recusada",
            posicao_fila: null,
            convocacao_deadline: null,
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao marcar recusa: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const marcarDesistente = async (criancaId: string, justificativa: string): Promise<Crianca> => {
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            status: "Desistente",
            cmei_atual_id: null,
            turma_atual_id: null,
            posicao_fila: null,
            convocacao_deadline: null,
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao marcar desistente: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const reativarCrianca = async (criancaId: string): Promise<Crianca> => {
    // TODO: Implementar lógica de atribuição de posição no final da fila
    
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            status: "Fila de Espera",
            cmei_atual_id: null,
            turma_atual_id: null,
            convocacao_deadline: null,
            // posicao_fila será atualizado por trigger ou função de fila
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao reativar criança: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const marcarFimDeFila = async (criancaId: string, justificativa: string): Promise<Crianca> => {
    // TODO: Implementar lógica de atribuição de posição no final da fila
    
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            status: "Fila de Espera",
            cmei_atual_id: null,
            turma_atual_id: null,
            convocacao_deadline: null,
            // posicao_fila será atualizado por trigger ou função de fila
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao marcar fim de fila: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const realocarCrianca = async (criancaId: string, data: ConvocationData): Promise<Crianca> => {
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            cmei_atual_id: data.cmei_id,
            turma_atual_id: data.turma_id,
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao realocar criança: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const transferirCrianca = async (criancaId: string, justificativa: string): Promise<Crianca> => {
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            status: "Desistente",
            cmei_atual_id: null,
            turma_atual_id: null,
            posicao_fila: null,
            convocacao_deadline: null,
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao transferir criança: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

export const solicitarRemanejamento = async (criancaId: string, justificativa: string): Promise<Crianca> => {
    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update({
            status: "Remanejamento Solicitado",
        })
        .eq('id', criancaId)
        .select(`
            *,
            cmeis (nome),
            turmas (nome)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao solicitar remanejamento: ${error.message}`);
    }
    
    // TODO: Adicionar registro no histórico (tabela 'historico')
    
    return mapDbToCrianca(updatedCriancaDb);
};

// --- Funções de Suporte (Mockadas anteriormente) ---

// Mock list of CMEIs and their available turmas (simplified)
// Esta função será mantida, mas adaptada para usar IDs reais e buscar dados de turmas
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
            const base = t.turmas_base as { idade_minima_meses: number, idade_maxima_meses: number };
            return ageInMonths >= base.idade_minima_meses && ageInMonths <= base.idade_maxima_meses;
        })
        .map(t => ({
            cmei: (t.cmeis as { nome: string }).nome,
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

// --- Mapeamento de Tipos para o Frontend ---

// Exporta a tipagem Crianca para uso nos componentes
export type { Crianca };

// Exporta a tipagem InscricaoFormData (já importada)
// Exporta a tipagem ConvocationData (já definida acima)

// Exporta a tipagem para o histórico (se necessário, mas vamos usar a tabela 'historico' real)
// Por enquanto, mantemos a interface HistoricoEntry para compatibilidade com o frontend.
export interface HistoricoEntry {
  data: string; // YYYY-MM-DD
  acao: string;
  detalhes: string;
  usuario: string;
}

// Mock de histórico (será substituído pela tabela 'historico' real em breve)
export const fetchHistoricoCrianca = async (criancaId: string): Promise<HistoricoEntry[]> => {
    const { data, error } = await supabase
        .from('historico')
        .select('*')
        .eq('crianca_id', criancaId)
        .order('created_at', { ascending: false });
        
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
    }));
};