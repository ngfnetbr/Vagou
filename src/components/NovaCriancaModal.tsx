import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Inscricao from "@/pages/Inscricao"; // Import Inscricao
import { InscricaoFormData } from "@/lib/schemas/inscricao-schema"; // Import type from schema file
import { Crianca } from "@/lib/mock-data"; // Import Crianca type

interface NovaCriancaModalProps {
  onClose: () => void;
  initialData?: Crianca; // Data for editing
}

// Helper to map Crianca data structure to InscricaoFormData for form default values
const mapCriancaToFormData = (crianca: Crianca): InscricaoFormData => ({
  nomeCrianca: crianca.nome,
  dataNascimento: crianca.dataNascimento,
  sexo: crianca.sexo,
  programasSociais: crianca.programasSociais,
  aceitaQualquerCmei: crianca.aceitaQualquerCmei,
  cmei1: crianca.cmei1,
  cmei2: crianca.cmei2 || '',
  nomeResponsavel: crianca.responsavel,
  cpf: crianca.cpfResponsavel,
  telefone: crianca.telefoneResponsavel,
  telefone2: crianca.telefoneResponsavel, // Assuming only one phone is stored in mock, using it for both
  email: crianca.emailResponsavel || '',
  endereco: crianca.endereco || '',
  bairro: crianca.bairro || '',
  observacoes: crianca.observacoes || '',
});

const NovaCriancaModalContent = ({ onClose, initialData }: NovaCriancaModalProps) => {
  const isEditing = !!initialData;
  const defaultValues = isEditing ? mapCriancaToFormData(initialData) : undefined;

  const handleSuccess = () => {
    // This handles both successful submission and deletion (via onSuccess in Inscricao)
    onClose();
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? `Editar Criança: ${initialData.nome}` : "Registrar Nova Criança"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Atualize os dados cadastrais da criança." : "Preencha os dados para realizar a inscrição de uma nova criança no sistema."}
        </DialogDescription>
      </DialogHeader>
      {/* Pass onSuccess handler, isModal flag, initialData/id for editing, and onClose for cancellation */}
      <Inscricao 
        onSuccess={handleSuccess} 
        onCancel={onClose} // Passa a função de fechar para o botão Cancelar
        isModal={true} 
        initialData={defaultValues}
        criancaId={initialData?.id}
      />
    </DialogContent>
  );
};

export default NovaCriancaModalContent;