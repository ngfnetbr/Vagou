import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, ArrowRight, CheckCircle, ListOrdered, GraduationCap, Users, Save } from "lucide-react";
import { useState, useMemo } from "react";
import { useTransicoes, CriancaClassificada, StatusTransicao } from "@/hooks/use-transicoes";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Transicoes = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  // O ano alvo é o ano letivo para o qual estamos planejando
  const [targetYear, setTargetYear] = useState<number>(nextYear);
  
  const { 
    classificacao, 
    isLoading, 
    isExecuting, 
    executeTransition, 
    updatePlanning, 
    savePlanning, 
    isSaving 
  } = useTransicoes(targetYear);

  const anosDisponiveis = useMemo(() => {
    // Oferece o ano atual e os próximos 3 anos para planejamento
    return [currentYear, nextYear, nextYear + 1, nextYear + 2];
  }, [currentYear, nextYear]);
  
  const cutoffDate = format(new Date(targetYear, 2, 31), 'dd/MM/yyyy'); // Mês 2 é Março

  const { concluintes, remanejamentoInterno, filaReclassificada } = useMemo(() => {
    const concluintes = classificacao.filter(c => c.statusTransicao === 'Concluinte');
    const remanejamentoInterno = classificacao.filter(c => c.statusTransicao === 'Remanejamento Interno');
    const filaReclassificada = classificacao.filter(c => c.statusTransicao === 'Fila Reclassificada');
    
    return { concluintes, remanejamentoInterno, filaReclassificada };
  }, [classificacao]);
  
  const handleExecuteTransition = async () => {
    await executeTransition();
  };
  
  const getStatusBadge = (status: CriancaClassificada['statusTransicao']) => {
    switch (status) {
        case 'Concluinte':
            return <Badge className="bg-destructive/20 text-destructive">Concluinte</Badge>;
        case 'Remanejamento Interno':
            return <Badge className="bg-secondary/20 text-secondary">Remanejamento Interno</Badge>;
        case 'Fila Reclassificada':
            return <Badge className="bg-accent/20 text-foreground">Fila Reclassificada</Badge>;
        default:
            return <Badge variant="outline">Manter Status</Badge>;
    }
  };
  
  const statusOptions: { value: StatusTransicao, label: string }[] = [
    { value: 'Remanejamento Interno', label: 'Remanejamento Interno' },
    { value: 'Fila Reclassificada', label: 'Fila Reclassificada' },
    { value: 'Concluinte', label: 'Concluinte (Evasão)' },
    { value: 'Manter Status', label: 'Manter Status Atual' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planejamento de Transição Anual</h1>
          <p className="text-muted-foreground">Prepare o sistema para o próximo ano letivo reclassificando crianças e liberando vagas.</p>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Configuração da Transição
            </CardTitle>
            <CardDescription>
              Selecione o ano letivo alvo para calcular a nova classificação etária.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Ano Letivo Alvo
                </label>
                <Select onValueChange={(value) => setTargetYear(Number(value))} value={String(targetYear)} disabled={isLoading || isExecuting || isSaving}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {anosDisponiveis.map(year => (
                      <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Alert className="py-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Data de Corte</AlertTitle>
                    <AlertDescription>
                        A classificação etária será calculada com base na idade da criança em 
                        <span className="font-semibold"> {cutoffDate} </span>.
                    </AlertDescription>
                </Alert>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold mb-2">Resumo do Planejamento ({classificacao.length} crianças ativas)</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-secondary/10 border-secondary">
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-secondary" />
                                <p className="text-xl font-bold text-secondary">{remanejamentoInterno.length}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Remanejamento Interno</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-accent/10 border-accent">
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2">
                                <ListOrdered className="h-5 w-5 text-foreground" />
                                <p className="text-xl font-bold text-foreground">{filaReclassificada.length}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Fila Reclassificada</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-destructive/10 border-destructive">
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-destructive" />
                                <p className="text-xl font-bold text-destructive">{concluintes.length}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Concluintes (Evasão)</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-border">
                <Button 
                    variant="outline"
                    className="flex-1 text-primary border-primary hover:bg-primary/10"
                    onClick={savePlanning}
                    disabled={isSaving || isExecuting || isLoading || classificacao.length === 0}
                >
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {isSaving ? "Salvando..." : "Salvar Planejamento"}
                </Button>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            disabled={isExecuting || isLoading || classificacao.length === 0}
                        >
                            {isExecuting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                            )}
                            {isExecuting ? "Aplicando..." : `Aplicar Transição para ${targetYear}`}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Aplicação da Transição?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação irá aplicar o planejamento atual, alterando o status de {classificacao.length} crianças. 
                                <span className="font-semibold text-destructive block mt-2">Esta ação é irreversível e deve ser feita apenas uma vez por ano letivo.</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isExecuting}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleExecuteTransition} 
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                disabled={isExecuting}
                            >
                                {isExecuting ? "Aplicando..." : "Confirmar e Aplicar"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabela de Detalhes da Classificação */}
        <Card>
            <CardHeader>
                <CardTitle>Detalhes da Reclassificação</CardTitle>
                <CardDescription>
                    Ajuste manualmente a ação sugerida para cada criança, se necessário.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="ml-3 text-lg text-muted-foreground">Classificando crianças...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Criança</TableHead>
                                    <TableHead>Status Atual</TableHead>
                                    <TableHead>Idade Corte ({cutoffDate})</TableHead>
                                    <TableHead>Turma Base Atual</TableHead>
                                    <TableHead>Turma Base {targetYear}</TableHead>
                                    <TableHead className="w-[250px]">Ação Sugerida (Ajuste Manual)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classificacao.length > 0 ? (
                                    classificacao.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.nome}</TableCell>
                                            <TableCell>{c.status}</TableCell>
                                            <TableCell>{c.idadeCorte !== null ? `${c.idadeCorte} ano(s)` : 'N/A'}</TableCell>
                                            <TableCell>{c.turmaBaseAtual}</TableCell>
                                            <TableCell className="font-semibold">{c.turmaBaseProximoAno}</TableCell>
                                            <TableCell>
                                                <Select 
                                                    value={c.statusTransicao} 
                                                    onValueChange={(value: StatusTransicao) => updatePlanning(c.id, value)}
                                                    disabled={isExecuting || isSaving}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Ação Sugerida" />
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
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            Nenhuma criança ativa encontrada para classificação.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Transicoes;