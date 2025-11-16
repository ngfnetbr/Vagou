import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { CriancaClassificada } from '@/hooks/use-transicoes';
import { Badge } from "@/components/ui/badge";

interface StatusMassaModalProps {
    selectedIds: string[];
    onClose: () => void;
    onConfirmMassStatusUpdate: (ids: string[], status: CriancaClassificada['status'], justificativa: string) => void;
    // Novas props para customização
    allowedStatus?: CriancaClassificada['status'][];
    actionTitle?: string;
    actionDescription?: string;
}

const StatusMassaModal = ({ 
    selectedIds, 
    onClose, 
    onConfirmMassStatusUpdate,
    allowedStatus = ['Desistente', 'Recusada'], // Default para status de saída
    actionTitle = "Mudar Status em Massa",
    actionDescription = "Selecione o novo status e forneça uma justificativa para as crianças selecionadas.",
}: StatusMassaModalProps) => {
    const [justificativa, setJustificativa] = useState('');
    const [isPending, setIsPending] = useState(false);
    
    // No contexto de 'Concluinte', o status de saída é 'Desistente'
    const statusToApply: CriancaClassificada['status'] = allowedStatus[0] || 'Desistente'; 

    const handleConfirm = () => {
        if (!justificativa.trim()) {
            toast.error("A justificativa é obrigatória para a mudança de status em massa.");
            return;
        }
        
        setIsPending(true);
        
        // Chama a função de planejamento com o status restrito
        onConfirmMassStatusUpdate(selectedIds, statusToApply, justificativa);
        
        toast.success(`${selectedIds.length} crianças marcadas para ${statusToApply}.`, {
            description: "A mudança será aplicada ao executar a transição."
        });
        
        setIsPending(false);
        onClose();
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{actionTitle}</DialogTitle>
                <DialogDescription>
                    {actionDescription}
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <p className="text-sm text-muted-foreground">
                    Você está planejando marcar <span className="font-semibold text-primary">{selectedIds.length} crianças</span> como <Badge variant="destructive" className="bg-destructive/20 text-destructive">Concluinte/Saída ({statusToApply})</Badge>.
                </p>
                
                <div className="space-y-2">
                    <label htmlFor="justificativa" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Justificativa (Obrigatório)
                    </label>
                    <Textarea
                        id="justificativa"
                        placeholder="Motivo da conclusão do ciclo/saída em massa..."
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                        rows={4}
                        disabled={isPending}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose} disabled={isPending}>
                    Cancelar
                </Button>
                <Button onClick={handleConfirm} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {isPending ? "Planejando..." : `Confirmar Saída (${selectedIds.length})`}
                </Button>
            </div>
        </DialogContent>
    );
};

export default StatusMassaModal;