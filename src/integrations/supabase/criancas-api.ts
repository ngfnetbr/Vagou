import { supabase } from "@/integrations/supabase/client";
import { InscricaoFormData } from "@/lib/schemas/inscricao-schema";
import { Crianca } from "./types";
import { mapDbToCrianca, mapFormToDb, registerHistorico } from "./utils";

// Campos de relacionamento que sempre buscamos
const SELECT_FIELDS = `
    *,
    cmeis (nome),
    turmas (nome)
`;

export const fetchCriancas = async (): Promise<Crianca[]> => {
  const { data, error } = await supabase
    .from('criancas')
    .select(SELECT_FIELDS)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(mapDbToCrianca);
};

export const getCriancaById = async (id: string): Promise<Crianca | undefined> => {
    const { data, error } = await supabase
        .from('criancas')
        .select(SELECT_FIELDS)
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
  
  const { data: newCriancaDb, error } = await supabase
    .from('criancas')
    .insert([payload])
    .select(SELECT_FIELDS)
    .single();

  if (error) {
    throw new Error(`Erro ao cadastrar criança: ${error.message}`);
  }
  
  const newCrianca = mapDbToCrianca(newCriancaDb);
  await registerHistorico(newCrianca.id, "Inscrição Realizada", `Nova inscrição para ${newCrianca.nome}. Status: Fila de Espera.`);
  
  return newCrianca;
};

export const updateCrianca = async (id: string, data: InscricaoFormData): Promise<Crianca> => {
    const payload = mapFormToDb(data);
    
    // Remove campos de status inicial para não sobrescrever o status atual
    delete (payload as any).status;
    delete (payload as any).cmei_atual_id;
    delete (payload as any).turma_atual_id;
    delete (payload as any).posicao_fila;
    delete (payload as any).convocacao_deadline;

    const { data: updatedCriancaDb, error } = await supabase
        .from('criancas')
        .update(payload)
        .eq('id', id)
        .select(SELECT_FIELDS)
        .single();

    if (error) {
        throw new Error(`Erro ao atualizar criança: ${error.message}`);
    }
    
    const updatedCrianca = mapDbToCrianca(updatedCriancaDb);
    await registerHistorico(updatedCrianca.id, "Dados Cadastrais Atualizados", `Dados de ${updatedCrianca.nome} atualizados.`);
    
    return updatedCrianca;
};

export const deleteCrianca = async (id: string): Promise<void> => {
    // Buscamos o nome antes de deletar para o histórico
    const crianca = await getCriancaById(id);
    
    const { error } = await supabase
        .from('criancas')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Erro ao excluir criança: ${error.message}`);
    }
    
    if (crianca) {
        await registerHistorico(id, "Criança Excluída", `Registro de ${crianca.nome} excluído permanentemente do sistema.`);
    }
};