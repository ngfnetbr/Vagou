import * as z from "zod";
import { isValidCpf } from "@/lib/utils/form-helpers";

// Esquema de validação com Zod
export const formSchema = z.object({
  nomeCrianca: z.string().min(1, "Nome completo da criança é obrigatório."),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória."),
  sexo: z.enum(["feminino", "masculino"], { message: "Selecione o sexo da criança." }),
  programasSociais: z.enum(["sim", "nao"], { message: "Selecione se é beneficiário de programas sociais." }),
  aceitaQualquerCmei: z.enum(["sim", "nao"], { message: "Selecione se aceita qualquer CMEI." }),
  cmei1: z.string().min(1, "1ª Opção de CMEI é obrigatória."),
  cmei2: z.string().optional().or(z.literal('')),
  nomeResponsavel: z.string().min(1, "Nome completo do responsável é obrigatório."),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório.")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Formato esperado: 000.000.000-00.")
    .refine(isValidCpf, { message: "CPF inválido." }),
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório.")
    .regex(/^\(\d{2}\) \d \d{4}-\d{4}$/, "Telefone inválido. Formato esperado: (00) 9 0000-0000."),
  telefone2: z.string().optional().or(z.literal('')),
  email: z.string().email("E-mail inválido.").optional().or(z.literal('')),
  endereco: z.string().optional().or(z.literal('')),
  bairro: z.string().optional().or(z.literal('')),
  observacoes: z.string().optional().or(z.literal('')),
});

export type InscricaoFormData = z.infer<typeof formSchema>;