import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Download, Filter, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

const Relatorios = () => {
  const [cmeiFilter, setCmeiFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("mes-atual");
  const [isGenerating, setIsGenerating] = useState(false);

  const relatorios = [
    {
      categoria: "Matrículas",
      itens: [
        { nome: "Lista de Matrículas Ativas", descricao: "Relatório completo das matrículas ativas por CMEI", id: "matriculas_ativas" },
        { nome: "Histórico de Matrículas", descricao: "Relatório de todas as matrículas (ativas e inativas)", id: "historico_matriculas" },
        { nome: "Matrículas por Turma", descricao: "Lista de alunos agrupados por turma", id: "matriculas_turma" },
      ]
    },
    {
      categoria: "Fila de Espera",
      itens: [
        { nome: "Fila de Espera Geral", descricao: "Relatório completo da fila de espera ordenada", id: "fila_geral" },
        { nome: "Fila por CMEI", descricao: "Fila de espera separada por unidade", id: "fila_cmei" },
        { nome: "Análise de Prioridades", descricao: "Distribuição de crianças por tipo de prioridade", id: "analise_prioridades" },
      ]
    },
    {
      categoria: "CMEIs",
      itens: [
        { nome: "Capacidade e Ocupação", descricao: "Relatório de capacidade e taxa de ocupação por CMEI", id: "capacidade_ocupacao" },
        { nome: "Lista de CMEIs", descricao: "Informações cadastrais de todos os CMEIs", id: "lista_cmeis" },
      ]
    },
    {
      categoria: "Convocações",
      itens: [
        { nome: "Convocações Pendentes", descricao: "Lista de convocações aguardando resposta", id: "convocacoes_pendentes" },
        { nome: "Histórico de Convocações", descricao: "Relatório completo de todas as convocações", id: "historico_convocacoes" },
      ]
    },
  ];
  
  const handleGeneratePdf = (relatorioNome: string) => {
    setIsGenerating(true);
    
    const cmei = cmeiFilter === 'todos' ? 'Todos os CMEIs' : cmeiFilter;
    
    toast.info(`Gerando relatório: ${relatorioNome}`, {
        description: `Filtros aplicados: CMEI: ${cmei}, Período: ${periodoFilter}.`,
        duration: 3000,
    });

    // Simula o tempo de processamento do PDF
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Relatório gerado com sucesso!", {
        description: `O download de "${relatorioNome}" foi iniciado.`,
      });
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Geração de relatórios em formato PDF</p>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle>Filtros Globais</CardTitle>
            </div>
            <CardDescription>
              Selecione os filtros que serão aplicados aos relatórios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cmei-filter">Filtrar por CMEI</Label>
                <Select onValueChange={setCmeiFilter} value={cmeiFilter} disabled={isGenerating}>
                  <SelectTrigger id="cmei-filter">
                    <SelectValue placeholder="Todos os CMEIs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os CMEIs</SelectItem>
                    <SelectItem value="CMEI Centro">CMEI Centro</SelectItem>
                    <SelectItem value="CMEI Norte">CMEI Norte</SelectItem>
                    <SelectItem value="CMEI Sul">CMEI Sul</SelectItem>
                    <SelectItem value="CMEI Leste">CMEI Leste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodo-filter">Período</Label>
                <Select onValueChange={setPeriodoFilter} value={periodoFilter} disabled={isGenerating}>
                  <SelectTrigger id="periodo-filter">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes-atual">Mês Atual</SelectItem>
                    <SelectItem value="trimestre">Último Trimestre</SelectItem>
                    <SelectItem value="semestre">Último Semestre</SelectItem>
                    <SelectItem value="ano">Ano Atual</SelectItem>
                    <SelectItem value="personalizado">Período Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {relatorios.map((categoria) => (
          <div key={categoria.categoria} className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">{categoria.categoria}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {categoria.itens.map((relatorio) => (
                <Card key={relatorio.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{relatorio.nome}</CardTitle>
                        <CardDescription className="mt-1">
                          {relatorio.descricao}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleGeneratePdf(relatorio.nome)}
                        disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      {isGenerating ? "Gerando..." : "Gerar PDF"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Relatorios;