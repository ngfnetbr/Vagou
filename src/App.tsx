import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Importando Navigate
import Inscricao from "./pages/Inscricao";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import CMEIs from "./pages/admin/CMEIs";
import Matriculas from "./pages/admin/Matriculas";
import Fila from "./pages/admin/Fila";
import Criancas from "./pages/admin/Criancas";
import Turmas from "./pages/admin/Turmas";
import Relatorios from "./pages/admin/Relatorios";
import Configuracoes from "./pages/admin/Configuracoes";
import Transicoes from "./pages/admin/Transicoes";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";
import DetalhesTurma from "./pages/admin/DetalhesTurma";
import DetalhesCrianca from "./pages/admin/DetalhesCrianca";
import { SessionContextProvider } from "./components/SessionContextProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} /> {/* Rota raiz redireciona para Login */}
            <Route path="/login" element={<Login />} />
            <Route path="/publico/inscricao" element={<Inscricao />} />
            
            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="cmeis" element={<CMEIs />} />
              <Route path="matriculas" element={<Matriculas />} />
              <Route path="fila" element={<Fila />} />
              <Route path="criancas" element={<Criancas />} />
              <Route path="criancas/:id" element={<DetalhesCrianca />} />
              <Route path="turmas" element={<Turmas />} />
              <Route path="turmas/:id" element={<DetalhesTurma />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="transicoes" element={<Transicoes />} />
              <Route path="logs" element={<Logs />} />
            </Route>
            
            {/* Logs Route (Mantido para compatibilidade, mas redireciona para /admin/logs) */}
            <Route path="/logs" element={<Navigate to="/admin/logs" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;