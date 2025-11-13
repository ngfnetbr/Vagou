import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useCriancas } from "@/hooks/use-criancas";
import { formSchema, InscricaoFormData } from "@/lib/schemas/inscricao-schema";
import { CriancaDataForm } from "@/components/forms/CriancaDataForm";
import { ResponsavelDataForm } from "@/components/forms/ResponsavelDataForm";
import { EnderecoDataForm } from "@/components/forms/EnderecoDataForm";

interface InscricaoProps {
  onSuccess?: (data: InscricaoFormData) => void;
  isModal?: boolean;
}

const Inscricao = ({ onSuccess, isModal = false }: InscricaoProps) => {
  const { addCrianca, isAdding } = useCriancas();

  const form = useForm<InscricaoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCrianca: "",
      dataNascimento: "",
      sexo: "feminino",
      programasSociais: "nao",
      aceitaQualquerCmei: "nao",
      cmei1: "",
      cmei2: "",
      nomeResponsavel: "",
      cpf: "",
      telefone: "",
      telefone2: "",
      email: "",
      endereco: "",
      bairro: "",
      observacoes: "",
    },
  });

  const cmeiOptions = [
    { value: "CMEI Centro", label: "CMEI Centro" },
    { value: "CMEI Norte", label: "CMEI Norte" },
    { value: "CMEI Sul", label: "CMEI Sul" },
    { value: "CMEI Leste", label: "CMEI Leste" },
  ];

  const selectedCmei1 = form.watch("cmei1");
  const filteredCmei2Options = cmeiOptions.filter(
    (cmei) => cmei.value !== selectedCmei1
  );

  const onSubmit = async (values: InscricaoFormData) => {
    if (onSuccess) {
      // Admin context: use mutation
      try {
        await addCrianca(values);
        onSuccess(values);
        form.reset();
      } catch (error) {
        // Error handled by useCriancas hook toast
      }
    } else {
      // Public context: placeholder for public submission logic
      toast.success("Inscrição realizada com sucesso!", {
        description: "Seu protocolo de inscrição será enviado por e-mail.",
      });
      form.reset();
    }
  };

  return (
    <div className={isModal ? "p-0" : "container mx-auto px-4 py-6"}>
      <div className="max-w-4xl mx-auto">
        {!isModal && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Nova Inscrição para Vaga
            </h1>
            <p className="text-muted-foreground">
              Preencha o formulário abaixo para cadastrar a criança na fila de espera.
            </p>
          </div>
        )}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <CriancaDataForm 
              cmeiOptions={cmeiOptions}
              filteredCmei2Options={filteredCmei2Options}
              selectedCmei1={selectedCmei1}
            />

            <ResponsavelDataForm />

            <EnderecoDataForm />

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => form.reset()}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                disabled={isAdding}
              >
                {isAdding ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isAdding ? "Cadastrando..." : (onSuccess ? "Cadastrar Criança" : "Cadastrar")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Inscricao;