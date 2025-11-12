import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Logs = () => {
  const logs = [
    {
      id: 1,
      timestamp: "07/11/2025 14:32:15",
      usuario: "admin@cidade.gov.br",
      acao: "Matrícula criada",
      detalhes: "Nova matrícula: Ana Silva Santos - CMEI Centro",
      tipo: "success"
    },
    {
      id: 2,
      timestamp: "07/11/2025 14:15:42",
      usuario: "gestor@cmei-norte.gov.br",
      acao: "Convocação enviada",
      detalhes: "Convocação enviada para Carlos Eduardo Silva",
      tipo: "info"
    },
    {
      id: 3,
      timestamp: "07/11/2025 13:58:20",
      usuario: "admin@cidade.gov.br",
      acao: "CMEI atualizado",
      detalhes: "Capacidade do CMEI Sul alterada de 180 para 200",
      tipo: "warning"
    },
    {
      id: 4,
      timestamp: "07/11/2025 13:45:10",
      usuario: "sistema",
      acao: "Backup automático",
      detalhes: "Backup diário realizado com sucesso",
      tipo: "success"
    },
    {
      id: 5,
      timestamp: "07/11/2025 12:30:05",
      usuario: "gestor@cmei-leste.gov.br",
      acao: "Transferência aprovada",
      detalhes: "Transferência de Lucas Oliveira de CMEI Norte para CMEI Leste",
      tipo: "info"
    },
    {
      id: 6,
      timestamp: "07/11/2025 11:20:33",
      usuario: "admin@cidade.gov.br",
      acao: "Usuário criado",
      detalhes: "Novo gestor cadastrado: gestor@cmei-oeste.gov.br",
      tipo: "success"
    },
    {
      id: 7,
      timestamp: "07/11/2025 10:15:22",
      usuario: "admin@cidade.gov.br",
      acao: "Importação de dados",
      detalhes: "45 crianças importadas via planilha",
      tipo: "success"
    },
    {
      id: 8,
      timestamp: "07/11/2025 09:05:11",
      usuario: "sistema",
      acao: "Tentativa de login falha",
      detalhes: "Tentativa de login com credenciais inválidas",
      tipo: "error"
    },
  ];

  const getTipoBadge = (tipo: string) => {
    const variants: Record<string, { className: string }> = {
      "success": { className: "bg-secondary/20 text-secondary" },
      "info": { className: "bg-primary/20 text-primary" },
      "warning": { className: "bg-accent/20 text-foreground" },
      "error": { className: "bg-destructive/20 text-destructive" },
    };
    
    const config = variants[tipo] || { className: "" };
    const labels: Record<string, string> = {
      "success": "Sucesso",
      "info": "Info",
      "warning": "Alerta",
      "error": "Erro"
    };
    
    return <Badge className={config.className}>{labels[tipo] || tipo}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Logs do Sistema</h1>
            <p className="text-muted-foreground">Histórico detalhado de todas as ações no sistema</p>
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Download className="mr-2 h-4 w-4" />
            Exportar Logs
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar nos logs..." 
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as ações</SelectItem>
                    <SelectItem value="matricula">Matrículas</SelectItem>
                    <SelectItem value="convocacao">Convocações</SelectItem>
                    <SelectItem value="usuario">Usuários</SelectItem>
                    <SelectItem value="sistema">Sistema</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Alerta</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell className="text-sm">{log.usuario}</TableCell>
                    <TableCell className="font-medium">{log.acao}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md">
                      {log.detalhes}
                    </TableCell>
                    <TableCell>{getTipoBadge(log.tipo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Logs;
