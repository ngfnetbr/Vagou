import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, ArrowRight, CheckCircle, ListOrdered, GraduationCap, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { useTransicoes, CriancaClassificada } from "@/hooks/use-transicoes";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const Transicoes = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  // O ano alvo é o ano letivo para o qual estamos planejando
  const [targetYear, setTargetYear] = useState<number>(nextYear);
  
  const { classificacao, isLoading, isExecuting, executeTransition } = useTransicoes(targetYear);

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
    await executeTransition(classificacao);
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
                <Select onValueChange={(value) => setTargetYear(Number(value))} value={String(targetYear)} disabled={isLoading || isExecuting}>
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
                        <span className="font-semibold"> 31 de Março de {targetYear} </span>.
                    </AlertDescription>
                </Alert>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-semibold mb-2">Resumo da Classificação ({classificacao.length} crianças ativas)</h3>
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
            
            <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                onClick={handleExecuteTransition}
                disabled={isExecuting || isLoading || classificacao.length === 0}
            >
                {isExecuting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                )}
                {isExecuting ? "Executando Transição..." : `Executar Transição para ${targetYear}`}
            </Button>
          </CardContent>
        </Card>
        
        {/* Tabela de Detalhes da Classificação */}
        <Card>
            <CardHeader>
                <CardTitle>Detalhes da Reclassificação</CardTitle>
                <CardDescription>
                    Lista de todas as crianças ativas e sua classificação para o ano letivo de {targetYear}.
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
                                    <TableHead>Ação Sugerida</TableHead>
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
                                            <TableCell>{getStatusBadge(c.statusTransicao)}</TableCell>
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