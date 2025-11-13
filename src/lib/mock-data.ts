export interface HistoricoEntry {
  data: string; // YYYY-MM-DD
  acao: string;
  detalhes: string;
  usuario: string;
}

export interface Crianca {
  id: number;
  nome: string;
  dataNascimento: string; // YYYY-MM-DD format
  idade: string; // Calculated field for display
  responsavel: string;
  cpfResponsavel: string;
  telefoneResponsavel: string;
  emailResponsavel?: string;
  endereco?: string;
  bairro?: string;
  sexo: "feminino" | "masculino";
  programasSociais: "sim" | "nao";
  aceitaQualquerCmei: "sim" | "nao";
  cmei1: string;
  cmei2?: string;
  observacoes?: string;
  status: "Matriculada" | "Matriculado" | "Fila de Espera" | "Convocado";
  cmei: string; // CMEI atual ou preferencial
  historico: HistoricoEntry[];
}

let mockCriancas: Crianca[] = [
  {
    id: 1,
    nome: "Ana Silva Santos",
    dataNascimento: "2023-03-15",
    idade: "1 ano e 10 meses",
    responsavel: "Maria Silva",
    cpfResponsavel: "111.111.111-11",
    telefoneResponsavel: "(44) 9 1111-1111",
    sexo: "feminino",
    programasSociais: "nao",
    aceitaQualquerCmei: "nao",
    cmei1: "CMEI Centro",
    cmei2: "CMEI Norte",
    status: "Matriculada",
    cmei: "CMEI Centro",
    historico: [
      { data: "2024-01-20", acao: "Matrícula Efetivada", detalhes: "Matriculada no Berçário I - Sala A", usuario: "Gestor Centro" },
      { data: "2024-01-10", acao: "Convocação Aceita", detalhes: "Convocação para CMEI Centro aceita", usuario: "Sistema" },
      { data: "2023-12-01", acao: "Inscrição Inicial", detalhes: "Inscrição na fila de espera", usuario: "Responsável" },
    ]
  },
  {
    id: 2,
    nome: "João Pedro Costa",
    dataNascimento: "2023-05-22",
    idade: "1 ano e 8 meses",
    responsavel: "Pedro Costa",
    cpfResponsavel: "222.222.222-22",
    telefoneResponsavel: "(44) 9 2222-2222",
    sexo: "masculino",
    programasSociais: "sim",
    aceitaQualquerCmei: "sim",
    cmei1: "CMEI Norte",
    status: "Matriculado",
    cmei: "CMEI Norte",
    historico: [
      { data: "2024-02-01", acao: "Matrícula Efetivada", detalhes: "Matriculado no Maternal I - Sala B", usuario: "Gestor Norte" },
      { data: "2024-01-25", acao: "Convocação Aceita", detalhes: "Convocação para CMEI Norte aceita", usuario: "Sistema" },
      { data: "2023-11-15", acao: "Inscrição Inicial", detalhes: "Inscrição na fila de espera (Prioridade Social)", usuario: "Responsável" },
    ]
  },
  {
    id: 3,
    nome: "Carlos Eduardo Silva",
    dataNascimento: "2023-07-08",
    idade: "1 ano e 6 meses",
    responsavel: "Eduardo Silva",
    cpfResponsavel: "333.333.333-33",
    telefoneResponsavel: "(44) 9 3333-3333",
    sexo: "masculino",
    programasSociais: "nao",
    aceitaQualquerCmei: "nao",
    cmei1: "CMEI Sul",
    status: "Fila de Espera",
    cmei: "N/A",
    historico: [
      { data: "2024-03-01", acao: "Inscrição Inicial", detalhes: "Inscrição na fila de espera", usuario: "Responsável" },
    ]
  },
  {
    id: 4,
    nome: "Mariana Costa Santos",
    dataNascimento: "2023-04-30",
    idade: "1 ano e 9 meses",
    responsavel: "Ana Costa",
    cpfResponsavel: "444.444.444-44",
    telefoneResponsavel: "(44) 9 4444-4444",
    sexo: "feminino",
    programasSociais: "sim",
    aceitaQualquerCmei: "sim",
    cmei1: "CMEI Leste",
    status: "Convocado",
    cmei: "CMEI Leste",
    historico: [
      { data: "2024-04-10", acao: "Convocação Enviada", detalhes: "Convocação para CMEI Leste", usuario: "Sistema" },
      { data: "2024-03-20", acao: "Inscrição Inicial", detalhes: "Inscrição na fila de espera (Prioridade Social)", usuario: "Responsável" },
    ]
  },
];

// Helper function to calculate age string (simplified)
const calculateAgeString = (dobString: string): string => {
  const today = new Date();
  const dob = new Date(dobString + 'T00:00:00'); // Ensure date is treated consistently
  
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < dob.getDate())) {
    years--;
    months += 12;
  }
  
  if (years > 0) {
    return `${years} ano(s) e ${months} meses`;
  }
  return `${months} meses`;
};


// Utility functions to simulate API
export const fetchCriancas = async (): Promise<Crianca[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // Recalculate age on fetch for dynamic display
  return mockCriancas.map(c => ({
    ...c,
    idade: calculateAgeString(c.dataNascimento)
  }));
};

// Type for data coming from the Inscricao form (which is used for new children)
export interface InscricaoFormData {
  nomeCrianca: string;
  dataNascimento: string; // YYYY-MM-DD
  sexo: "feminino" | "masculino";
  programasSociais: "sim" | "nao";
  aceitaQualquerCmei: "sim" | "nao";
  cmei1: string;
  cmei2?: string;
  nomeResponsavel: string;
  cpf: string;
  telefone: string;
  telefone2?: string;
  email?: string;
  endereco?: string;
  bairro?: string;
  observacoes?: string;
}

// Helper to map InscricaoFormData to Crianca structure
const mapInscricaoToCrianca = (data: InscricaoFormData, id: number, currentCmei: string, currentStatus: Crianca['status']): Crianca => {
    return {
        id: id,
        nome: data.nomeCrianca,
        dataNascimento: data.dataNascimento,
        idade: calculateAgeString(data.dataNascimento),
        responsavel: data.nomeResponsavel,
        cpfResponsavel: data.cpf,
        telefoneResponsavel: data.telefone,
        emailResponsavel: data.email,
        endereco: data.endereco,
        bairro: data.bairro,
        sexo: data.sexo,
        programasSociais: data.programasSociais,
        aceitaQualquerCmei: data.aceitaQualquerCmei,
        cmei1: data.cmei1,
        cmei2: data.cmei2,
        observacoes: data.observacoes,
        status: currentStatus,
        cmei: currentCmei,
        historico: [{
            data: new Date().toISOString().split('T')[0],
            acao: id ? "Dados Atualizados" : "Inscrição Inicial",
            detalhes: id ? "Dados cadastrais atualizados via painel administrativo." : "Inscrição na fila de espera via painel administrativo.",
            usuario: "Admin/Gestor",
        }],
    };
};


export const addCriancaFromInscricao = async (data: InscricaoFormData): Promise<Crianca> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newId = mockCriancas.length > 0 ? Math.max(...mockCriancas.map(c => c.id)) + 1 : 1;
  
  const initialStatus: Crianca['status'] = "Fila de Espera";
  const initialCmei = "N/A";
  
  const newCrianca = mapInscricaoToCrianca(data, newId, initialCmei, initialStatus);
  
  mockCriancas.push(newCrianca);
  return newCrianca;
};

export const updateCrianca = async (id: number, data: InscricaoFormData): Promise<Crianca> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockCriancas.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Criança não encontrada");

    const existingCrianca = mockCriancas[index];
    
    // Preserve status and current CMEI, but update all other fields
    const updatedCrianca = mapInscricaoToCrianca(data, id, existingCrianca.cmei, existingCrianca.status);
    
    // Merge new data with existing history (keeping existing history and adding the update log)
    updatedCrianca.historico = [...existingCrianca.historico, ...updatedCrianca.historico];

    mockCriancas[index] = updatedCrianca;
    return updatedCrianca;
};

export const deleteCrianca = async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockCriancas = mockCriancas.filter(c => c.id !== id);
};

export const getCriancaById = (id: number): Crianca | undefined => {
    const crianca = mockCriancas.find(c => c.id === id);
    if (crianca) {
        // Recalculate age for display consistency
        return {
            ...crianca,
            idade: calculateAgeString(crianca.dataNascimento)
        };
    }
    return undefined;
};