import { useEffect, useCallback } from 'react';
import { useLocation, UNSAFE_NavigationContext } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook para alertar o usuário sobre alterações não salvas ao tentar navegar ou fechar a aba.
 * @param hasUnsavedChanges Booleano que indica se há alterações pendentes.
 * @param message Mensagem de alerta.
 */
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean, message: string = "Você tem alterações não salvas. Deseja realmente sair?") {
  const location = useLocation();
  // Removendo a desestruturação de navigator, pois não é usada e causa erro de tipagem no RRv6
  // const { navigator } = UNSAFE_NavigationContext; 

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

  // 2. Alerta ao tentar navegar internamente (usando o history.block)
  
  const blockNavigation = useCallback((nextLocation: any) => {
    if (hasUnsavedChanges && nextLocation.pathname !== location.pathname) {
        toast.warning("Planejamento não salvo!", {
            description: "Salve suas alterações antes de navegar para outra página.",
            duration: 5000,
        });
        return true; // Indica que a navegação deve ser bloqueada (embora o RRv6 não suporte bloqueio fácil)
    }
    return false;
  }, [hasUnsavedChanges, location.pathname]);
  
  // Embora o RRv6 não tenha um hook useBlocker simples, 
  // o listener de beforeunload é o que realmente impede a perda de dados ao fechar a aba.
}