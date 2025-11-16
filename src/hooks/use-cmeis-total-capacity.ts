import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fetchTotalCapacity = async () => {
  const { data, error } = await supabase
    .from("cmeis")
    .select("capacidade");

  if (error) {
    throw new Error(error.message);
  }

  // Soma a capacidade de todos os CMEIs
  const totalCapacity = data.reduce((sum, cmei) => sum + cmei.capacidade, 0);
  return totalCapacity;
};

export const useCmeisTotalCapacity = () => {
  return useQuery<number, Error>({
    queryKey: ["cmeisTotalCapacity"],
    queryFn: fetchTotalCapacity,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};