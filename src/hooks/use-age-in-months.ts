import { useMemo } from "react";
import { differenceInMonths, parseISO } from "date-fns";

/**
 * Calcula a idade em meses a partir de uma string de data de nascimento (YYYY-MM-DD).
 * @param dobString Data de nascimento no formato YYYY-MM-DD.
 * @returns Idade em meses (number) ou null se a data for inválida.
 */
export function useAgeInMonths(dobString: string | undefined): number | null {
  return useMemo(() => {
    if (!dobString) return null;
    
    try {
      // Adicionamos 'T00:00:00' para garantir que a data seja interpretada como UTC meia-noite,
      // evitando problemas de fuso horário que poderiam mudar o dia.
      const dob = parseISO(dobString + 'T00:00:00');
      const today = new Date();

      if (isNaN(dob.getTime())) return null;

      // Calcula a diferença em meses
      return differenceInMonths(today, dob);
    } catch (e) {
      return null;
    }
  }, [dobString]);
}