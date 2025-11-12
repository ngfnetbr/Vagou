import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TurmasBase = () => {
  const turmasBase = [
    {
      id: 1,
      nome: "Berçário I",
      idadeMinima: 4,
      idadeMaxima: 11,
      capacidade: 15,
      descricao: "4 a 11 meses"
    },
    {
      id: 2,
      nome: "Berçário II",
      idadeMinima: 1,
      idadeMaxima: 1,
      capacidade: 15,
      descricao: "1 ano"
    },
    {
      id: 3,
      nome: "Maternal I",
      idadeMinima: 2,
      idadeMaxima: 2,
      capacidade: 20,
      descricao: "2 anos"
    },
    {
      id: 4,
      nome: "Maternal II",
      idadeMinima: 3,
      idadeMaxima: 3,
      capacidade: 20,
      descricao: "3 anos"
    },
    {
      id: 5,
      nome: "Pré I",
      idadeMinima: 4,
      idadeMaxima: 4,
      capacidade: 25,
      descricao: "4 anos"
    },
    {
      id: 6,
      nome: "Pré II",
      idadeMinima: 5,
      idadeMaxima: 5,
      capacidade: 25,
      descricao: "5 anos"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Turmas Base</h1>
            <p className="text-muted-foreground">Configuração dos modelos de turmas com faixas etárias</p>
          </div>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nova Turma Base
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmasBase.map((turma) => (
            <Card key={turma.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{turma.nome}</CardTitle>
                      <CardDescription>{turma.descricao}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Faixa Etária:</span>
                    <Badge variant="secondary">{turma.descricao}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Capacidade:</span>
                    <span className="font-semibold">{turma.capacidade} alunos</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-3 w-3" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Turma Base</CardTitle>
            <CardDescription>
              Crie um novo modelo de turma com faixa etária e capacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome-turma">Nome da Turma *</Label>
                <Input 
                  id="nome-turma" 
                  placeholder="Ex: Maternal III"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacidade-turma">Capacidade Padrão *</Label>
                <Input 
                  id="capacidade-turma" 
                  type="number"
                  placeholder="20"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idade-min">Idade Mínima (meses ou anos)</Label>
                <Input 
                  id="idade-min" 
                  type="number"
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idade-max">Idade Máxima (meses ou anos)</Label>
                <Input 
                  id="idade-max" 
                  type="number"
                  placeholder="23"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao-turma">Descrição da Faixa Etária</Label>
              <Input 
                id="descricao-turma" 
                placeholder="Ex: 1 a 2 anos"
              />
            </div>

            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Turma Base
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TurmasBase;
