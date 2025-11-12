import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Send, Eye, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const Convocacoes = () => {
  const convocacoes = [
    { 
      id: 1, 
      crianca: "Carlos Eduardo Silva", 
      responsavel: "Eduardo Silva", 
      cmei: "CMEI Centro", 
      dataConvocacao: "20/01/2025",
      prazoResposta: "27/01/2025",
      status: "Pendente"
    },
    { 
      id: 2, 
      crianca: "Mariana Costa Santos", 
      responsavel: "Ana Costa", 
      cmei: "CMEI Norte", 
      dataConvocacao: "18/01/2025",
      prazoResposta: "25/01/2025",
      status: "Confirmada"
    },
    { 
      id: 3, 
      crianca: "Pedro Henrique Oliveira", 
      responsavel: "José Oliveira", 
      cmei: "CMEI Sul", 
      dataConvocacao: "15/01/2025",
      prazoResposta: "22/01/2025",
      status: "Pendente"
    },
    { 
      id: 4, 
      crianca: "Julia Santos Lima", 
      responsavel: "Maria Lima", 
      cmei: "CMEI Leste", 
      dataConvocacao: "12/01/2025",
      prazoResposta: "19/01/2025",
      status: "Recusada"
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string, text: string }> = {
      "Pendente": { className: "bg-accent/20 text-foreground", text: "Pendente" },
      "Confirmada": { className: "bg-secondary/20 text-secondary", text: "Confirmada" },
      "Recusada": { className: "bg-destructive/20 text-destructive", text: "Recusada" },
    };
    
    const config = variants[status] || { className: "", text: status };
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Convocações</h1>
            <p className="text-muted-foreground">Gerenciamento de convocações para matrícula</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Send className="mr-2 h-4 w-4" />
              Nova Convocação
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">15</div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">32</div>
              <p className="text-sm text-muted-foreground">Confirmadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">8</div>
              <p className="text-sm text-muted-foreground">Recusadas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome da criança ou responsável..." 
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por CMEI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os CMEIs</SelectItem>
                    <SelectItem value="centro">CMEI Centro</SelectItem>
                    <SelectItem value="norte">CMEI Norte</SelectItem>
                    <SelectItem value="sul">CMEI Sul</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmada">Confirmada</SelectItem>
                    <SelectItem value="recusada">Recusada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criança</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>CMEI</TableHead>
                  <TableHead>Data Convocação</TableHead>
                  <TableHead>Prazo Resposta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {convocacoes.map((convocacao) => (
                  <TableRow key={convocacao.id}>
                    <TableCell className="font-medium">{convocacao.crianca}</TableCell>
                    <TableCell>{convocacao.responsavel}</TableCell>
                    <TableCell>{convocacao.cmei}</TableCell>
                    <TableCell>{convocacao.dataConvocacao}</TableCell>
                    <TableCell>{convocacao.prazoResposta}</TableCell>
                    <TableCell>{getStatusBadge(convocacao.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          {convocacao.status === "Pendente" && (
                            <>
                              <DropdownMenuItem className="text-secondary">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirmar matrícula
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Marcar como recusada
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Reenviar notificação
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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

export default Convocacoes;
