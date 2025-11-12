import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Matriculas = () => {
  const matriculas = [
    { id: 1, crianca: "Ana Silva Santos", responsavel: "Maria Silva", cmei: "CMEI Centro", turma: "Berçário I", status: "Ativa" },
    { id: 2, crianca: "João Pedro Costa", responsavel: "Pedro Costa", cmei: "CMEI Norte", turma: "Maternal II", status: "Ativa" },
    { id: 3, crianca: "Lucas Oliveira", responsavel: "Carla Oliveira", cmei: "CMEI Sul", turma: "Pré I", status: "Ativa" },
    { id: 4, crianca: "Beatriz Santos", responsavel: "José Santos", cmei: "CMEI Leste", turma: "Pré II", status: "Ativa" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Matrículas</h1>
            <p className="text-muted-foreground">Gerenciamento completo de matrículas ativas</p>
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
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
                    <SelectValue placeholder="Filtrar por turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as turmas</SelectItem>
                    <SelectItem value="bercario">Berçário</SelectItem>
                    <SelectItem value="maternal">Maternal</SelectItem>
                    <SelectItem value="pre">Pré-escola</SelectItem>
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
                  <TableHead>Turma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matriculas.map((matricula) => (
                  <TableRow key={matricula.id}>
                    <TableCell className="font-medium">{matricula.crianca}</TableCell>
                    <TableCell>{matricula.responsavel}</TableCell>
                    <TableCell>{matricula.cmei}</TableCell>
                    <TableCell>{matricula.turma}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                        {matricula.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Realocar</DropdownMenuItem>
                          <DropdownMenuItem>Solicitar remanejamento</DropdownMenuItem>
                          <DropdownMenuItem>Transferir</DropdownMenuItem>
                          <DropdownMenuItem>Trancar matrícula</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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

export default Matriculas;
