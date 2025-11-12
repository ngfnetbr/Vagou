import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

const Cadastro = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Cadastro de Responsável
            </h1>
            <p className="text-muted-foreground">
              Crie sua conta para acompanhar inscrições
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
              <CardDescription>
                Preencha seus dados para se cadastrar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome-completo">Nome Completo *</Label>
                <Input 
                  id="nome-completo" 
                  placeholder="Seu nome completo"
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf-cadastro">CPF *</Label>
                <Input 
                  id="cpf-cadastro" 
                  placeholder="000.000.000-00"
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-cadastro">E-mail *</Label>
                <Input 
                  id="email-cadastro" 
                  type="email" 
                  placeholder="seu.email@exemplo.com"
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone-cadastro">Telefone *</Label>
                <Input 
                  id="telefone-cadastro" 
                  placeholder="(00) 00000-0000"
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha-cadastro">Senha *</Label>
                <Input 
                  id="senha-cadastro" 
                  type="password" 
                  placeholder="••••••••"
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirma-senha">Confirmar Senha *</Label>
                <Input 
                  id="confirma-senha" 
                  type="password" 
                  placeholder="••••••••"
                  className="border-input"
                />
              </div>

              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Cadastro;
