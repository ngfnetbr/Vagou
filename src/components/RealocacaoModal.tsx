"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Loader2, RotateCcw } from "lucide-react";
import { Crianca, ConvocationData } from "@/lib/mock-data";
import { useAvailableTurmas } from "@/hooks/use-criancas";
import { toast } from "sonner";
import { useMemo } from "react";

// Schema for Realocation Form
const vagaSchema = z.object({
  cmeiTurma: z.string().min(1, "Selecione uma Turma disponível."),
});

type VagaFormData = z.infer<typeof vagaSchema>;

interface RealocacaoModalProps {
  crianca: Crianca;
  onClose: () => void;
  onConfirm: (criancaId: number, data: ConvocationData) => Promise<void>;
  isPending: boolean;
}

const RealocacaoModal = ({ crianca, onClose, onConfirm, isPending }: RealocacaoModalProps) => {
  // Usamos useAvailableTurmas, mas filtramos apenas o CMEI atual
  const { data: availableTurmas, isLoading: isLoadingTurmas } = useAvailableTurmas(crianca.id);

  const form = useForm<VagaFormData>({
    resolver: zodResolver(vagaSchema),
    defaultValues: {
      cmeiTurma: "",
    },
  });

  const onSubmit = async (values: VagaFormData) => {
    const [cmei, turma] = values.cmeiTurma.split('|');
    
    if (!cmei || !turma) {
        toast.error("Erro de seleção", { description: "Formato de CMEI/Turma inválido." });
        return;
    }

    const convocationData: ConvocationData = { cmei, turma };

    try {
        await onConfirm(crianca.id, convocationData);
        onClose();
    } catch (error) {
        // Error handled by useCriancas hook
    }
  };
  
  const currentCmei = crianca.cmei;
  
  // Filtra apenas turmas DENTRO do CMEI atual para Realocação
  const filteredTurmas = useMemo(() => {
      if (!availableTurmas) return [];
      
      return availableTurmas.filter(t => t.cmei === currentCmei);
      
  }, [availableTurmas, currentCmei]);


  return (
    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Realocar {crianca.nome}</DialogTitle>
        <DialogDescription>
          Selecione a nova turma dentro do CMEI {crianca.cmei} para realocar a criança.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-3 text-sm p-3 bg-muted/50 rounded-lg border border-border">
        <p className="font-semibold">Localização Atual:</p>
        <p className="text-muted-foreground">{crianca.cmei} ({crianca.turmaAtual})</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="cmeiTurma"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Turma *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingTurmas || isPending}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingTurmas ? "Buscando turmas..." : "Selecione a Turma"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingTurmas ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : filteredTurmas.length > 0 ? (
                        filteredTurmas.map((turma, index) => {
                            const label = `${turma.turma} (${turma.vagas} vagas)`;
                            
                            // O valor deve incluir o CMEI para a função onConfirm
                            return (
                                <SelectItem 
                                    key={index} 
                                    value={`${turma.cmei}|${turma.turma}`}
                                >
                                    {label}
                                </SelectItem>
                            );
                        })
                    ) : (
                        <SelectItem value="none" disabled>Nenhuma turma compatível encontrada no CMEI atual.</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            
            <Button 
                type="submit" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                disabled={isPending || !form.formState.isValid || isLoadingTurmas || filteredTurmas.length === 0}
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <RotateCcw className="mr-2 h-4 w-4" />
                )}
                Confirmar Realocação
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default RealocacaoModal;