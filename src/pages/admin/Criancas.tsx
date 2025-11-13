import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, Calendar, MapPin, List, LayoutGrid, MoreVertical, Eye, Edit } from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DialogTrigger } from "@/components/ui/dialog"; // Importar DialogTrigger
import NovaCriancaModal from "@/components/NovaCriancaModal"; // Importar o novo modal


const Criancas = () => {
  const [isListView, setIsListView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  const criancas = [
    { 
      id: 1, 
      nome: "Ana Silva Santos", 
      dataNascimento: "15/03/2023", 
      idade: "1 ano e 10 meses",
      responsavel: "Maria Silva",
      status: "Matriculada",
      cmei: "CMEI Centro"
    },
    { 
      id: 2, 
      nome: "João Pedro Costa", 
      dataNascimento: "22/05/2023", 
      idade: "1 ano e 8 meses",
      responsavel: "Pedro Costa",
      status: "Matriculado",
      cmei: "CMEI Norte"
    },
    { 
      id: 3, 
      nome: "Carlos Eduardo Silva", 
      dataNascimento: "08/07/2023", 
      idade: "1 ano e 6 meses",
      responsavel: "Eduardo Silva",
      status: "Fila de Espera",
      cmei: "-"
    },
    { 
      id: 4, 
      nome: "Mariana Costa Santos", 
      dataNascimento: "30/04/2023", 
      idade: "1 ano e 9 meses",
      responsavel: "Ana Costa",
      status: "Fila de Espera",
      cmei: "-"
    },
    { 
      id: 5, 
      nome: "Pedro Henrique Oliveira", 
      dataNascimento: "12/06/2023", 
      idade: "1 ano e 7 meses",
      responsavel: "José Oliveira",
      status: "Convocado",
      cmei: "CMEI Sul"
    },
    { 
      id: 6, 
      nome: "Julia Santos Lima", 
      dataNascimento: "25/08/2023", 
      idade: "1 ano e 5 meses",
      responsavel: "Maria Lima",
      status: "Matriculada",
      cmei: "CMEI Leste"
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", className: string }> = {
      "Matriculada": { variant: "default", className: "bg-secondary text-secondary-foreground" },
      "Matriculado": { variant: "default", className: "bg-secondary text-secondary-foreground" },
      "Fila de Espera": { variant: "secondary", className: "" },
      "Convocado": { variant: "default", className: "bg-accent text-accent-foreground" },
    };
    
    const config = variants[status] || { variant: "outline" as const, className: "" };
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crianças</h1>
            <p className="text-muted-foreground">Cadastro e gerenciamento de todas as crianças do sistema</p>
          </div>
          <DialogTrigger asChild> {/* Envolve o botão com DialogTrigger */}
            <Button 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => setIsModalOpen(true)} // Abre o modal
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Criança
            </Button>
          </DialogTrigger>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome da criança..." 
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="matriculado">Matriculado</SelectItem>
                  <SelectItem value="fila">Fila de Espera</SelectItem>
                  <SelectItem value="convocado">Convocado</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup 
                type="single" 
                defaultValue="grid" 
                onValueChange={(value) => setIsListView(value === "list")}
                className="flex-shrink-0"
              >
                <ToggleGroupItem value="grid" aria-label="Visualizar em grade">
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="Visualizar em lista">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardHeader>
        </Card>

        {!isListView ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {criancas.map((crianca) => (
              <Card key={crianca.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{crianca.nome}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {crianca.idade}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Data Nasc.:</span>
                    <span className="font-medium">{crianca.dataNascimento}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Responsável:</span>
                    <span className="font-medium">{crianca.responsavel}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(crianca.status)}
                  </div>
                  {crianca.cmei !== "-" && (
                    <div className="flex items-center gap-2 text-sm pt-2 border-t border-border">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">{crianca.cmei}</span>
                    </div>
                  )}
                  <div className="pt-2 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criança</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Data Nasc.</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>CMEI</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criancas.map((crianca) => (
                    <TableRow key={crianca.id}>
                      <TableCell className="font-medium">{crianca.nome}</TableCell>
                      <TableCell>{crianca.responsavel}</TableCell>
                      <TableCell>{crianca.dataNascimento}</TableCell>
                      <TableCell>{crianca.idade}</TableCell>
                      <TableCell>{getStatusBadge(crianca.status)}</TableCell>
                      <TableCell>{crianca.cmei !== "-" ? crianca.cmei : "N/A"}</TableCell>
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
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
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
        )}
      </div>
      <NovaCriancaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> {/* Renderiza o modal */}
    </AdminLayout>
  );
};

export default Criancas;