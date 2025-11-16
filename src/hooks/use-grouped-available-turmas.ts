import { useMemo } from "react";
import { useAllAvailableTurmas, AvailableTurma } from "@/hooks/use-all-available-turmas";

interface GroupedTurmas {
    [cmeiName: string]: AvailableTurma[];
}

export const useGroupedAvailableTurmas = () => {
    const { data: allAvailableTurmas, isLoading, error } = useAllAvailableTurmas();

    const groupedTurmas = useMemo(() => {
        if (!allAvailableTurmas) return {};
        
        return allAvailableTurmas.reduce((acc, turma) => {
            if (!acc[turma.cmei]) {
                acc[turma.cmei] = [];
            }
            acc[turma.cmei].push(turma);
            return acc;
        }, {} as GroupedTurmas);
    }, [allAvailableTurmas]);

    return {
        groupedTurmas,
        allAvailableTurmas: allAvailableTurmas || [],
        isLoading,
        error,
    };
};