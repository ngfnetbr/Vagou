import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Download, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Relatorios = () => {
  const relatorios = [
    {
      categoria: "Matrículas",
      itens: [
        { nome: "Lista de Matrículas Ativas", descricao: "Relatório completo das matrículas ativas por CMEI" },
        { nome: "Histórico de Matrículas", descricao: "Relatório de todas as matrículas (ativas e inativas)" },
        { nome: "Matrículas por Turma", descricao: "Lista de alunos agrupados por turma" },
      ]
    },
    {
      categoria: "Fila de Espera",
      itens: [
        { nome: "Fila de Espera Geral", descricao: "Relatório completo da fila de espera ordenada" },
        { nome: "Fila por CMEI", descricao: "Fila de espera separada por unidade" },
        { nome: "Análise de Prioridades", descricao: "Distribuição de crianças por tipo de prioridade" },
      ]
    },
    {
      categoria: "CMEIs",
      itens: [
        { nome: "Capacidade e Ocupação", descricao: "Relatório de capacidade e taxa de ocupação por CMEI" },
        { nome: "Lista de CMEIs", descricao: "Informações cadastrais de todos os CMEIs" },
      ]
    },
    {
      categoria: "Convocações",
      itens: [
        { nome: "Convocações Pendentes", descricao: "Lista de convocações aguardando resposta" },
        { nome: "Histórico de Convocações", descricao: "Relatório completo de todas as convocações" },
      ]
    },
  ];

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
                <Select>
                  <SelectTrigger id="cmei-filter">
                    <SelectValue placeholder="Todos os CMEIs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os CMEIs</SelectItem>
                    <SelectItem value="centro">CMEI Centro</SelectItem>
                    <SelectItem value="norte">CMEI Norte</SelectItem>
                    <SelectItem value="sul">CMEI Sul</SelectItem>
                    <SelectItem value="leste">CMEI Leste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodo-filter">Período</Label>
                <Select>
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
                <Card key={relatorio.nome} className="hover:shadow-lg transition-shadow">
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
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Download className="mr-2 h-4 w-4" />
                      Gerar PDF
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
