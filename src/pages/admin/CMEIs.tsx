import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, MapPin, Users } from "lucide-react";

const CMEIs = () => {
  const cmeis = [
    { id: 1, nome: "CMEI Centro", endereco: "Rua Central, 123", capacidade: 150, ocupacao: 142 },
    { id: 2, nome: "CMEI Norte", endereco: "Av. Norte, 456", capacidade: 120, ocupacao: 115 },
    { id: 3, nome: "CMEI Sul", endereco: "Rua Sul, 789", capacidade: 180, ocupacao: 165 },
    { id: 4, nome: "CMEI Leste", endereco: "Av. Leste, 321", capacidade: 140, ocupacao: 128 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CMEIs</h1>
            <p className="text-muted-foreground">Gerenciamento dos Centros Municipais de Educação Infantil</p>
          </div>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo CMEI
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou endereço..." 
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {cmeis.map((cmei) => {
            const ocupacaoPercent = Math.round((cmei.ocupacao / cmei.capacidade) * 100);
            return (
              <Card key={cmei.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{cmei.nome}</span>
                    <span className={`text-sm font-normal px-2 py-1 rounded ${
                      ocupacaoPercent >= 90 
                        ? 'bg-destructive/20 text-destructive' 
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {ocupacaoPercent}% ocupado
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {cmei.endereco}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Capacidade</span>
                    </div>
                    <span className="font-semibold">{cmei.capacidade} vagas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ocupadas</span>
                    <span className="font-semibold text-primary">{cmei.ocupacao} alunos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Disponíveis</span>
                    <span className="font-semibold text-secondary">{cmei.capacidade - cmei.ocupacao} vagas</span>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Turmas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CMEIs;
