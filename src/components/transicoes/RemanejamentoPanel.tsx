"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, ListOrdered, GraduationCap, Move, CheckCircle, Loader2, XCircle, ListRestart, School, Eye } from "lucide-react";
import { Crianca, ConvocationData } from "@/integrations/supabase/types";
import { useMemo, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RealocacaoModal from "@/components/RealocacaoModal";
import JustificativaModal from "@/components/JustificativaModal";
import { useCriancas } from "@/hooks/use-criancas";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Tipagem para o agrupamento de dados
interface TurmaGroup {
    id: string;
    nomeCompleto: string;
    cmeiNome: string;
    capacidade: number;
    ocupacao: number;
    alunos: Crianca[];
}

interface RemanejamentoPanelProps {
    turmas: TurmaGroup[];
    fila: Crianca[];
    isLoading: boolean;
}

type JustificativaAction = 'desistente' | 'remanejamento' | 'transferir';

const RemanejamentoPanel = ({ turmas, fila, isLoading }: RemanejamentoPanelProps) => {
    const navigate = useNavigate();
    const { 
        realocarCrianca, 
        isRealocating, 
        marcarDesistente, 
        isMarkingDesistente,
        solicitarRemanejamento,
        isRequestingRemanejamento,
        transferirCrianca,
        isTransferring,
        refetch,
    } = useCriancas();
    
    // Estados para modais
    const [isVagaModalOpen, setIsVagaModalOpen] = useState(false);
    const [criancaToVaga, setCriancaToVaga] = useState<Crianca | undefined>(undefined);
    
    const [isJustificativaModalOpen, setIsJustificativaModalOpen] = useState(false);
    const [criancaToJustify, setCriancaToJustify] = useState<Crianca | undefined>(undefined);
    const [currentJustificativaAction, setCurrentJustificativaAction] = useState<JustificativaAction | undefined>(undefined);

    // --- Handlers de Ação ---

    const handleMoveClick = (crianca: Crianca) => {
        setCriancaToVaga(crianca);
        setIsVagaModalOpen(true);
    };
    
    const handleVagaConfirm = async (id: string, data: ConvocationData) => {
        await realocarCrianca({ id, data });
        setIsVagaModalOpen(false);
        setCriancaToVaga(undefined);
        refetch();
    };
    
    const handleJustificativaActionClick = (crianca: Crianca, action: JustificativaAction) => {
        setCriancaToJustify(crianca);
        setCurrentJustificativaAction(action);
        setIsJustificativaModalOpen(true);
    };
    
    const handleJustificativaConfirm = async (justificativa: string) => {
        if (!criancaToJustify || !currentJustificativaAction) return;
        
        const id = criancaToJustify.id;
        
        try {
            switch (currentJustificativaAction) {
              case 'desistente':
                await marcarDesistente({ id, justificativa });
                break;
              case 'remanejamento':
                await solicitarRemanejamento({ id, justificativa });
                break;
              case 'transferir':
                await transferirCrianca({ id, justificativa });
                break;
            }
            
            setIsJustificativaModalOpen(false);
            setCriancaToJustify(undefined);
            setCurrentJustificativaAction(undefined);
            refetch();
        } catch (e) {
            // Erro tratado pelo hook
        }
    };
    
    const getJustificativaProps = (action: JustificativaAction) => {
        const criancaNome = criancaToJustify?.nome || 'a criança';
        
        switch (action) {
          case 'desistente':
            return {
              title: `Marcar ${criancaNome} como Desistente`,
              description: "Confirme a desistência. A criança será marcada como 'Desistente' e removida da lista de matrículas ativas.",
              actionLabel: "Confirmar Desistência",
              isPending: isMarkingDesistente,
              actionVariant: 'destructive' as const,
            };
          case 'remanejamento':
            return {
              title: `Solicitar Remanejamento para ${criancaNome}`,
              description: "Descreva o motivo da solicitação de remanejamento. O status da criança será atualizado.",
              actionLabel: "Solicitar Remanejamento",
              isPending: isRequestingRemanejamento,
              actionVariant: 'secondary' as const,
            };
          case 'transferir':
            return {
              title: `Transferir ${criancaNome} (Mudança de Cidade)`,
              description: "Confirme a transferência por mudança de cidade. A matrícula será encerrada e a criança marcada como desistente.",
              actionLabel: "Confirmar Transferência",
              isPending: isTransferring,
              actionVariant: 'destructive' as const,
            };
          default:
            return { title: "", description: "", actionLabel: "", isPending: false, actionVariant: 'destructive' as const };
        }
    };

    const getStatusColor = (status: Crianca['status']) => {
        switch (status) {
            case 'Matriculado':
            case 'Matriculada': return "bg-secondary text-secondary-foreground";
            case 'Convocado': return "bg-primary text-primary-foreground";
            case 'Remanejamento Solicitado': return "bg-accent text-accent-foreground";
            case 'Fila de Espera': return "bg-muted-foreground text-background";
            default: return "bg-gray-400 text-white";
        }
    };

    const groupedByCmei = useMemo(() => {
        const groups: Record<string, TurmaGroup[]> = {};
        turmas.forEach(t => {
            if (!groups[t.cmeiNome]) {
                groups[t.cmeiNome] = [];
            }
            groups[t.cmeiNome].push(t);
        });
        return groups;
    }, [turmas]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-3 text-lg text-muted-foreground">Carregando dados de remanejamento...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Turmas Ativas */}
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-secondary" />
                Matrículas Ativas ({turmas.reduce((sum, t) => sum + t.alunos.length, 0)})
            </h2>
            <div className="space-y-8">
                {Object.entries(groupedByCmei).map(([cmeiName, turmasList]) => (
                    <div key={cmeiName} className="space-y-4">
                        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                            <School className="h-5 w-5" />
                            {cmeiName}
                        </h3>
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                            {turmasList.map(turma => (
                                <Card key={turma.id} className="border-2 border-secondary/50">
                                    <CardHeader className="p-3 pb-2">
                                        <CardTitle className="text-base flex justify-between items-center">
                                            {turma.nomeCompleto}
                                            <Badge variant="secondary" className="text-xs">
                                                {turma.ocupacao}/{turma.capacidade}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Vagas Livres: {turma.capacidade - turma.ocupacao}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0 space-y-2 max-h-64 overflow-y-auto">
                                        {turma.alunos.length === 0 ? (
                                            <p className="text-xs text-muted-foreground text-center py-4">Nenhum aluno ativo nesta turma.</p>
                                        ) : (
                                            turma.alunos.map(aluno => (
                                                <div key={aluno.id} className="flex items-center justify-between p-2 bg-card border rounded-md hover:bg-muted/50 transition-colors">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{aluno.nome}</span>
                                                        <Badge className={getStatusColor(aluno.status)}>{aluno.status}</Badge>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => handleMoveClick(aluno)}
                                                        disabled={isRealocating}
                                                    >
                                                        <Move className="h-4 w-4 text-primary" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Fila de Espera */}
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 pt-8 border-t border-border mt-8">
                <ListOrdered className="h-6 w-6 text-accent" />
                Fila de Espera / Convocados ({fila.length})
            </h2>
            <Card>
                <CardContent className="p-4 grid lg:grid-cols-4 md:grid-cols-2 gap-4">
                    {fila.length === 0 ? (
                        <p className="text-muted-foreground col-span-full text-center py-4">A fila de espera está vazia.</p>
                    ) : (
                        fila.map(aluno => (
                            <div key={aluno.id} className="flex items-center justify-between p-2 bg-card border rounded-md hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{aluno.nome}</span>
                                    <Badge className={getStatusColor(aluno.status)}>{aluno.status}</Badge>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => navigate(`/admin/criancas/${aluno.id}`)}
                                >
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Modal de Realocação (Mover) */}
            <Dialog open={isVagaModalOpen} onOpenChange={setIsVagaModalOpen}>
                {criancaToVaga && (
                    <RealocacaoModal
                        crianca={criancaToVaga}
                        onConfirm={handleVagaConfirm}
                        onClose={() => setIsVagaModalOpen(false)}
                        isPending={isRealocating}
                    />
                )}
            </Dialog>
            
            {/* Modal de Justificativa */}
            <Dialog open={isJustificativaModalOpen} onOpenChange={setIsJustificativaModalOpen}>
                {criancaToJustify && currentJustificativaAction && (
                    <JustificativaModal
                        {...getJustificativaProps(currentJustificativaAction)}
                        onConfirm={handleJustificativaConfirm}
                        onClose={() => {
                            setIsJustificativaModalOpen(false);
                            setCriancaToJustify(undefined);
                            setCurrentJustificativaAction(undefined);
                        }}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default RemanejamentoPanel;