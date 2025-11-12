import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, ListOrdered, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total de Crianças",
      value: "1,234",
      icon: Users,
      description: "Cadastradas no sistema",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Matrículas Ativas",
      value: "856",
      icon: GraduationCap,
      description: "Alunos matriculados",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Fila de Espera",
      value: "378",
      icon: ListOrdered,
      description: "Aguardando vaga",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Taxa de Ocupação",
      value: "94%",
      icon: TrendingUp,
      description: "Capacidade utilizada",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de gestão de vagas</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Convocações Pendentes</CardTitle>
              <CardDescription>Últimas convocações aguardando confirmação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Maria Silva Santos</p>
                      <p className="text-sm text-muted-foreground">CMEI Exemplo {i}</p>
                    </div>
                    <span className="text-xs bg-accent/20 text-foreground px-2 py-1 rounded">
                      Pendente
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { acao: "Nova matrícula", detalhe: "João Pedro - CMEI Central", hora: "10:30" },
                  { acao: "Convocação enviada", detalhe: "Ana Costa - CMEI Norte", hora: "09:15" },
                  { acao: "Transferência", detalhe: "Lucas Oliveira - CMEI Sul", hora: "08:45" },
                ].map((atividade, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{atividade.acao}</p>
                      <p className="text-sm text-muted-foreground">{atividade.detalhe}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{atividade.hora}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
