import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Bell, XCircle, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const Fila = () => {
  const filaEspera = [
    { 
      posicao: 1, 
      crianca: "Carlos Eduardo Silva", 
      responsavel: "Eduardo Silva", 
      cmei: "CMEI Centro", 
      dataNascimento: "15/03/2023",
      dataInscricao: "10/01/2025",
      prioridade: "Vulnerabilidade Social"
    },
    { 
      posicao: 2, 
      crianca: "Mariana Costa Santos", 
      responsavel: "Ana Costa", 
      cmei: "CMEI Norte", 
      dataNascimento: "22/05/2023",
      dataInscricao: "12/01/2025",
      prioridade: "Irmão Matriculado"
    },
    { 
      posicao: 3, 
      crianca: "Pedro Henrique Oliveira", 
      responsavel: "José Oliveira", 
      cmei: "CMEI Sul", 
      dataNascimento: "08/07/2023",
      dataInscricao: "15/01/2025",
      prioridade: "Normal"
    },
    { 
      posicao: 4, 
      crianca: "Julia Santos Lima", 
      responsavel: "Maria Lima", 
      cmei: "CMEI Leste", 
      dataNascimento: "30/04/2023",
      dataInscricao: "18/01/2025",
      prioridade: "Gemelares"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fila de Espera</h1>
            <p className="text-muted-foreground">Gerenciamento da fila de espera para vagas</p>
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Download className="mr-2 h-4 w-4" />
            Exportar Fila
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">378</div>
              <p className="text-sm text-muted-foreground">Total na Fila</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">156</div>
              <p className="text-sm text-muted-foreground">Com Prioridade</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">45</div>
              <p className="text-sm text-muted-foreground">Convocados este mês</p>
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
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="vulnerabilidade">Vulnerabilidade</SelectItem>
                    <SelectItem value="irmao">Irmão Matriculado</SelectItem>
                    <SelectItem value="gemelares">Gemelares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Posição</TableHead>
                  <TableHead>Criança</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>CMEI Preferência</TableHead>
                  <TableHead>Data Insc.</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filaEspera.map((item) => (
                  <TableRow key={item.posicao}>
                    <TableCell className="font-bold text-primary">#{item.posicao}</TableCell>
                    <TableCell className="font-medium">{item.crianca}</TableCell>
                    <TableCell>{item.responsavel}</TableCell>
                    <TableCell>{item.cmei}</TableCell>
                    <TableCell>{item.dataInscricao}</TableCell>
                    <TableCell>
                      <Badge variant={item.prioridade !== "Normal" ? "default" : "secondary"}>
                        {item.prioridade}
                      </Badge>
                    </TableCell>
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
                          <DropdownMenuItem className="text-secondary">
                            <Bell className="mr-2 h-4 w-4" />
                            Convocar para matrícula
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            Marcar como desistente
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

export default Fila;
