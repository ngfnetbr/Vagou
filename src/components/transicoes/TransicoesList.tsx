import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CriancaClassificada, StatusTransicao } from "@/hooks/use-transicoes";
import { Users, ArrowRight, CheckCircle, ListOrdered, GraduationCap, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";

interface TransicoesListProps {
    title: string;
    icon: React.ElementType;
    data: CriancaClassificada[];
    updatePlanning: (criancaId: string, newStatus: StatusTransicao) => void;
    isSaving: boolean;
    isExecuting: boolean;
}

const statusOptions: { value: StatusTransicao, label: string }[] = [
    { value: 'Remanejamento Interno', label: 'Remanejamento Interno' },
    { value: 'Fila Reclassificada', label: 'Fila Reclassificada' },
    { value: 'Concluinte', label: 'Concluinte (Evasão)' },
    { value: 'Manter Status', label: 'Manter Status Atual' },
];

const TransicoesList = ({ title, icon: Icon, data, updatePlanning, isSaving, isExecuting }: TransicoesListProps) => {
    
    // Agrupa por Turma Base do Próximo Ano
    const groupedByNextTurma = useMemo(() => {
        const groups: Record<string, CriancaClassificada[]> = {};
        data.forEach(c => {
            const key = c.turmaBaseProximoAno;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(c);
        });
        return groups;
    }, [data]);

    const getStatusColor = (status: StatusTransicao) => {
        switch (status) {
            case 'Concluinte': return "bg-destructive/20 text-destructive";
            case 'Remanejamento Interno': return "bg-secondary/20 text-secondary";
            case 'Fila Reclassificada': return "bg-accent/20 text-foreground";
            default: return "bg-muted/50 text-muted-foreground";
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{title} ({data.length})</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                {data.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Nenhuma criança neste grupo.</p>
                ) : (
                    Object.entries(groupedByNextTurma).map(([turmaBase, criancas]) => (
                        <div key={turmaBase} className="space-y-3 border p-3 rounded-lg bg-card">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <ArrowRight className="h-4 w-4 text-secondary" />
                                Próxima Turma Base: <Badge variant="secondary">{turmaBase}</Badge>
                            </h4>
                            <div className="space-y-2">
                                {criancas.map(c => (
                                    <div key={c.id} className="flex items-center justify-between p-2 border rounded-md">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{c.nome}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {c.status === 'Matriculado' || c.status === 'Matriculada' ? `CMEI: ${c.cmeiNome} (${c.turmaNome})` : `Fila: ${c.cmei1_preferencia}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(c.statusTransicao)}>
                                                {c.statusTransicao}
                                            </Badge>
                                            <Select 
                                                value={c.statusTransicao} 
                                                onValueChange={(value: StatusTransicao) => updatePlanning(c.id, value)}
                                                disabled={isExecuting || isSaving}
                                            >
                                                <SelectTrigger className="w-[150px] h-8 text-xs">
                                                    <SelectValue placeholder="Ajustar Ação" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default TransicoesList;