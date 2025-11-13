export interface Crianca {
  id: number;
  nome: string;
  dataNascimento: string; // YYYY-MM-DD format
  idade: string; // Calculated field for display
  responsavel: string;
  status: "Matriculada" | "Matriculado" | "Fila de Espera" | "Convocado";
  cmei: string;
}

let mockCriancas: Crianca[] = [
  {
    id: 1,
    nome: "Ana Silva Santos",
    dataNascimento: "2023-03-15",
    idade: "1 ano e 10 meses",
    responsavel: "Maria Silva",
    status: "Matriculada",
    cmei: "CMEI Centro"
  },
  {
    id: 2,
    nome: "João Pedro Costa",
    dataNascimento: "2023-05-22",
    idade: "1 ano e 8 meses",
    responsavel: "Pedro Costa",
    status: "Matriculado",
    cmei: "CMEI Norte"
  },
  {
    id: 3,
    nome: "Carlos Eduardo Silva",
    dataNascimento: "2023-07-08",
    idade: "1 ano e 6 meses",
    responsavel: "Eduardo Silva",
    status: "Fila de Espera",
    cmei: "N/A"
  },
  {
    id: 4,
    nome: "Mariana Costa Santos",
    dataNascimento: "2023-04-30",
    idade: "1 ano e 9 meses",
    responsavel: "Ana Costa",
    status: "Fila de Espera",
    cmei: "N/A"
  },
  {
    id: 5,
    nome: "Pedro Henrique Oliveira",
    dataNascimento: "2023-06-12",
    idade: "1 ano e 7 meses",
    responsavel: "José Oliveira",
    status: "Convocado",
    cmei: "CMEI Sul"
  },
  {
    id: 6,
    nome: "Julia Santos Lima",
    dataNascimento: "2023-08-25",
    idade: "1 ano e 5 meses",
    responsavel: "Maria Lima",
    status: "Matriculada",
    cmei: "CMEI Leste"
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
  // Ensure age is recalculated on fetch if necessary, though for mock data we rely on the stored value for simplicity unless adding new data.
  return mockCriancas;
};

// Type for data coming from the Inscricao form (which is used for new children)
export interface InscricaoFormData {
  nomeCrianca: string;
  dataNascimento: string; // YYYY-MM-DD
  sexo: "feminino" | "masculino";
  programasSociais: "sim" | "nao";
  aceitaQualquerCmei: "sim" | "nao";
  cmei1: string;
  cmei2: string;
  nomeResponsavel: string;
  cpf: string;
  telefone: string;
  telefone2?: string;
  email?: string;
  endereco?: string;
  bairro?: string;
  observacoes?: string;
}

export const addCriancaFromInscricao = async (data: InscricaoFormData): Promise<Crianca> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newId = mockCriancas.length > 0 ? Math.max(...mockCriancas.map(c => c.id)) + 1 : 1;
  
  // Determine initial status and CMEI based on form data (simplified logic)
  // New children added via admin panel start in Fila de Espera
  const initialStatus: Crianca['status'] = "Fila de Espera";
  const initialCmei = data.aceitaQualquerCmei === 'sim' ? data.cmei1 : data.cmei1; // Simplified: use cmei1 as preference
  
  const newCrianca: Crianca = {
    id: newId,
    nome: data.nomeCrianca,
    dataNascimento: data.dataNascimento,
    idade: calculateAgeString(data.dataNascimento),
    responsavel: data.nomeResponsavel,
    status: initialStatus,
    cmei: initialCmei,
  };
  
  mockCriancas.push(newCrianca);
  return newCrianca;
};

// Placeholder for update/delete
export const updateCrianca = async (updatedCrianca: Crianca): Promise<Crianca> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockCriancas = mockCriancas.map(c => c.id === updatedCrianca.id ? updatedCrianca : c);
    return updatedCrianca;
};

export const deleteCrianca = async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockCriancas = mockCriancas.filter(c => c.id !== id);
};

export const getCriancaById = (id: number): Crianca | undefined => {
    return mockCriancas.find(c => c.id === id);
};