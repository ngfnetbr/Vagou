import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CriancaClassificada, StatusTransicao } from "@/hooks/use-transicoes";
import { Users, ArrowRight, CheckCircle, ListOrdered, GraduationCap, XCircle, MoreVertical, Eye, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Importação adicionada

interface RemanejamentoTableProps {
    title: string;
    icon: React.ElementType;
    data: CriancaClassificada[];
    updatePlanning: (criancaId: string, newStatus: StatusTransicao) => void;
    isSaving: boolean;
    isExecuting: boolean;
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    toggleAllSelection: (ids: string[]) => void;
}

const statusOptions: { value: StatusTransicao, label: string }[] = [
    { value: 'Remanejamento Interno', label: 'Remanejamento Interno' },
    { value: 'Fila Reclassificada', label: 'Fila Reclassificada' },
    { value: 'Concluinte', label: 'Concluinte (Evasão)' },
    { value: 'Manter Status', label: 'Manter Status Atual' },
];

const getStatusColor = (status: StatusTransicao) => {
    switch (status) {
        case 'Concluinte': return "bg-destructive/20 text-destructive";
        case 'Remanejamento Interno': return "bg-secondary/20 text-secondary";
        case 'Fila Reclassificada': return "bg-accent/20 text-foreground";
        default: return "bg-muted/50 text-muted-foreground";
    }
};

export const RemanejamentoTable = ({ 
    title, 
    icon: Icon, 
    data, 
    updatePlanning, 
    isSaving, 
    isExecuting,
    selectedIds,
    toggleSelection,
    toggleAllSelection,
}: RemanejamentoTableProps) => {
    const navigate = useNavigate();
    const allIds = useMemo(() => data.map(c => c.id), [data]);
    const isAllSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
    const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{title} ({data.length})</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[70vh] overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={() => toggleAllSelection(allIds)}
                                    disabled={isExecuting || isSaving || data.length === 0}
                                />
                            </TableHead>
                            <TableHead>Criança</TableHead>
                            <TableHead>Turma Atual</TableHead>
                            <TableHead>Próxima Turma Base</TableHead>
                            <TableHead className="w-[180px]">Ação Planejada</TableHead>
                            <TableHead className="text-right w-[80px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-16 text-center text-muted-foreground">
                                    Nenhuma criança neste grupo.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(c.id)}
                                            onCheckedChange={() => toggleSelection(c.id)}
                                            disabled={isExecuting || isSaving}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{c.nome}</div>
                                        <div className="text-xs text-muted-foreground">{c.responsavel_nome}</div>
                                    </TableCell>
                                    <TableCell>
                                        {c.cmeiNome ? (
                                            <div className="text-sm">{c.cmeiNome} ({c.turmaNome})</div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">Fila de Espera</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{c.turmaBaseProximoAno}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select 
                                            value={c.statusTransicao} 
                                            onValueChange={(value: StatusTransicao) => updatePlanning(c.id, value)}
                                            disabled={isExecuting || isSaving}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
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
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/admin/criancas/${c.id}`)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Ver Detalhes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toast.info("Abrir modal de Realocação individual...")}>
                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                    Realocar Vaga
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};