import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface RealocacaoMassaModalProps {
    selectedCount: number;
    onClose: () => void;
}

// Mock de Turmas (em um ambiente real, isso viria de um hook)
const mockTurmas = [
    { id: "t1", nome: "Infantil 1 - Sala A (CMEI Centro)" },
    { id: "t2", nome: "Infantil 2 - Sala B (CMEI Norte)" },
    { id: "t3", nome: "Infantil 3 - Sala A (CMEI Sul)" },
];

const RealocacaoMassaModal = ({ selectedCount, onClose }: RealocacaoMassaModalProps) => {
    const [selectedTurma, setSelectedTurma] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        if (!selectedTurma) {
            toast.error("Selecione a turma de destino.");
            return;
        }
        
        setIsProcessing(true);
        // Simulação de API call para realocação em massa
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success(`Realocação de ${selectedCount} crianças concluída!`, {
            description: `Movidas para a turma ${mockTurmas.find(t => t.id === selectedTurma)?.nome}.`,
        });
        
        setIsProcessing(false);
        onClose();
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <div className="flex items-center gap-2">
                    <RotateCcw className="h-6 w-6 text-secondary" />
                    <DialogTitle>Realocação em Massa</DialogTitle>
                </div>
                <DialogDescription>
                    Mova <span className="font-semibold">{selectedCount} crianças</span> para uma nova turma.
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="turma-destino">Turma de Destino *</Label>
                    <Select onValueChange={setSelectedTurma} value={selectedTurma} disabled={isProcessing}>
                        <SelectTrigger id="turma-destino">
                            <SelectValue placeholder="Selecione a Turma" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockTurmas.map(turma => (
                                <SelectItem key={turma.id} value={turma.id}>
                                    {turma.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                </Button>
                <Button 
                    type="button" 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    onClick={handleConfirm}
                    disabled={isProcessing || !selectedTurma}
                >
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <RotateCcw className="mr-2 h-4 w-4" />
                    )}
                    Confirmar Realocação
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default RealocacaoMassaModal;