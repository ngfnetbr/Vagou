"use client";

import React from 'react';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAccessibilityStore } from '@/hooks/use-accessibility-store';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Eye, Text, Accessibility } from 'lucide-react';
import { cn } from '@/lib/utils';

const AccessibilityPanel = () => {
    const { 
        isHighContrastEnabled, 
        toggleHighContrast, 
        fontSizeScale, 
        setFontSize 
    } = useAccessibilityStore();
    
    const handleFontSizeChange = (scale: 'default' | 'medium' | 'large') => {
        setFontSize(scale);
    };

    return (
        <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
                <div className="flex items-center gap-3 text-primary">
                    <Accessibility className="h-6 w-6" />
                    <SheetTitle>Configurações de Acessibilidade</SheetTitle>
                </div>
                <SheetDescription>
                    Ajuste a visualização para melhorar a leitura e o contraste.
                </SheetDescription>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
                
                {/* Alto Contraste */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        Alto Contraste
                    </h3>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <Label htmlFor="high-contrast-switch" className="text-sm font-medium">
                            Ativar Modo Alto Contraste
                        </Label>
                        <Switch
                            id="high-contrast-switch"
                            checked={isHighContrastEnabled}
                            onCheckedChange={toggleHighContrast}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Melhora a legibilidade usando cores mais fortes (preto e branco).
                    </p>
                </div>
                
                <Separator />
                
                {/* Tamanho da Fonte */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Text className="h-5 w-5 text-primary" />
                        Tamanho da Fonte
                    </h3>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <Label className="text-sm font-medium">
                            Escala de Texto
                        </Label>
                        <div className="flex gap-2">
                            <Button 
                                variant={fontSizeScale === 'default' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => handleFontSizeChange('default')}
                                className={cn(fontSizeScale === 'default' && "bg-primary text-primary-foreground")}
                            >
                                Padrão
                            </Button>
                            <Button 
                                variant={fontSizeScale === 'medium' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => handleFontSizeChange('medium')}
                                className={cn(fontSizeScale === 'medium' && "bg-primary text-primary-foreground")}
                            >
                                Média
                            </Button>
                            <Button 
                                variant={fontSizeScale === 'large' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => handleFontSizeChange('large')}
                                className={cn(fontSizeScale === 'large' && "bg-primary text-primary-foreground")}
                            >
                                Grande
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Ajusta o tamanho base do texto em toda a aplicação.
                    </p>
                </div>
            </div>
        </SheetContent>
    );
};

export default AccessibilityPanel;