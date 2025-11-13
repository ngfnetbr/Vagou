import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Inscricao from "@/pages/Inscricao";

interface NovaCriancaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NovaCriancaModal = ({ isOpen, onClose }: NovaCriancaModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"> {/* Ajustado para ser maior e com scroll */}
        <DialogHeader>
          <DialogTitle>Registrar Nova Criança</DialogTitle>
          <DialogDescription>
            Preencha os dados para realizar a inscrição de uma nova criança no sistema.
          </DialogDescription>
        </DialogHeader>
        <Inscricao />
      </DialogContent>
    </Dialog>
  );
};

export default NovaCriancaModal;