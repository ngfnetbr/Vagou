import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Inscricao from "@/pages/Inscricao"; // Import Inscricao
import { InscricaoFormData } from "@/lib/schemas/inscricao-schema"; // Import type from schema file

interface NovaCriancaModalProps {
  onClose: () => void;
}

const NovaCriancaModalContent = ({ onClose }: NovaCriancaModalProps) => {
  const handleSuccess = (data: InscricaoFormData) => {
    // Logic after successful submission (handled by Inscricao component's mutation)
    onClose();
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Registrar Nova Criança</DialogTitle>
        <DialogDescription>
          Preencha os dados para realizar a inscrição de uma nova criança no sistema.
        </DialogDescription>
      </DialogHeader>
      {/* Pass onSuccess handler and isModal flag */}
      <Inscricao onSuccess={handleSuccess} isModal={true} />
    </DialogContent>
  );
};

export default NovaCriancaModalContent;