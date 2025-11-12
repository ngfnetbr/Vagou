import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Área Administrativa
            </h1>
            <p className="text-muted-foreground">
              Acesso restrito para gestores e diretores
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Entre com suas credenciais de acesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu.email@exemplo.com"
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="border-input"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <a href="#" className="text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              <Link to="/admin">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
              </Link>

              <div className="text-center text-sm text-muted-foreground">
                Não tem acesso administrativo?{" "}
                <Link to="/cadastro" className="text-primary hover:underline">
                  Cadastre-se como responsável
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Atenção:</strong> Esta área é exclusiva para usuários administrativos.
              Pais e responsáveis devem usar a área de consulta de inscrição.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
