import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Turmas = () => {
  const turmas = [
    {
      cmei: "CMEI Centro",
      turmas: [
        { 
          nome: "Berçário I - Manhã", 
          capacidade: 15, 
          ocupacao: 15,
          alunos: ["Ana Silva", "João Pedro", "Maria Clara", "Lucas Silva", "Beatriz Costa"]
        },
        { 
          nome: "Maternal I - Tarde", 
          capacidade: 20, 
          ocupacao: 18,
          alunos: ["Carlos Eduardo", "Julia Santos", "Pedro Henrique", "Laura Oliveira"]
        },
      ]
    },
    {
      cmei: "CMEI Norte",
      turmas: [
        { 
          nome: "Maternal II - Manhã", 
          capacidade: 20, 
          ocupacao: 19,
          alunos: ["Rafaela Lima", "Gabriel Costa", "Isabela Silva", "Miguel Santos"]
        },
        { 
          nome: "Pré I - Tarde", 
          capacidade: 25, 
          ocupacao: 22,
          alunos: ["Sofia Alves", "Davi Oliveira", "Helena Costa", "Arthur Silva"]
        },
      ]
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Turmas</h1>
            <p className="text-muted-foreground">Visualização de alunos por turma e CMEI</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4">
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por CMEI" />
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
          </CardHeader>
        </Card>

        {turmas.map((cmeiData) => (
          <div key={cmeiData.cmei} className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {cmeiData.cmei}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {cmeiData.turmas.map((turma, index) => {
                const ocupacaoPercent = Math.round((turma.ocupacao / turma.capacidade) * 100);
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{turma.nome}</CardTitle>
                          <CardDescription className="mt-1">
                            {turma.ocupacao} / {turma.capacidade} alunos
                          </CardDescription>
                        </div>
                        <Badge variant={ocupacaoPercent === 100 ? "default" : "secondary"}>
                          {ocupacaoPercent}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">Alunos Matriculados</h4>
                        <div className="space-y-2">
                          {turma.alunos.map((aluno, alunoIndex) => (
                            <div 
                              key={alunoIndex}
                              className="flex items-center justify-between p-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{aluno}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </div>
                          ))}
                          {turma.alunos.length < turma.ocupacao && (
                            <p className="text-xs text-muted-foreground text-center py-2">
                              + {turma.ocupacao - turma.alunos.length} alunos
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Ver Todos
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Gerenciar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Turmas;
