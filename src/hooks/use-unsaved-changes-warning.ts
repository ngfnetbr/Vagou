import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook para alertar o usuário sobre alterações não salvas ao tentar navegar ou fechar a aba.
 * @param hasUnsavedChanges Booleano que indica se há alterações pendentes.
 * @param message Mensagem de alerta.
 */
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean, message: string = "Você tem alterações não salvas. Deseja realmente sair?") {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Alerta ao tentar fechar a aba/navegador (beforeunload)
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = message;
        return message;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [hasUnsavedChanges, message]);

  // 2. Função para bloquear a navegação interna (usada no AdminSidebar)
  const blockNavigation = useCallback((to: string) => {
    if (hasUnsavedChanges && to !== location.pathname) {
        
        // Usamos um toast customizado para dar a opção de confirmar a perda de dados
        toast.warning("Planejamento não salvo!", {
            description: "Você tem alterações não salvas. Deseja sair e descartá-las?",
            duration: 10000,
            action: {
                label: "Descartar e Sair",
                onClick: () => {
                    // Se o usuário confirmar, navegamos
                    navigate(to);
                },
            },
        });
        return true; // Indica que a navegação foi bloqueada (o componente de navegação deve respeitar isso)
    }
    return false;
  }, [hasUnsavedChanges, location.pathname, navigate]);

  return blockNavigation;
}