import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Bell, MessageSquare, Mail, Smartphone, AlertCircle } from "lucide-react";
import { useConfiguracoes, ConfiguracoesFormData } from "@/hooks/use-configuracoes";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";

// Esquema de validação para as configurações de notificação (subconjunto do schema principal)
const notificacaoSchema = z.object({
  notificacao_email: z.boolean(),
  notificacao_sms: z.boolean(),
  notificacao_whatsapp: z.boolean(),
});

const Notificacoes = () => {
  const { config, isLoading, updateConfiguracoes, isUpdating } = useConfiguracoes();

  const form = useForm<z.infer<typeof notificacaoSchema>>({
    resolver: zodResolver(notificacaoSchema),
    values: {
      notificacao_email: config?.notificacao_email ?? true,
      notificacao_sms: config?.notificacao_sms ?? false,
      notificacao_whatsapp: config?.notificacao_whatsapp ?? false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof notificacaoSchema>) => {
    if (!config) {
        toast.error("Erro", { description: "Configurações não carregadas." });
        return;
    }
    
    // Mescla os dados de notificação com o restante dos dados de configuração
    const fullData: ConfiguracoesFormData = {
        ...config,
        ...data,
    };
    
    await updateConfiguracoes(fullData);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Carregando configurações de notificação...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Notificação
        </CardTitle>
        <CardDescription>
          Gerencie os canais de comunicação utilizados para alertar os responsáveis sobre o status da fila e convocações.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            
            {/* Canais de Notificação */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Canais Ativos</h3>

              <FormField
                control={form.control}
                name="notificacao_email"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="space-y-1 flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <FormLabel htmlFor="notif-email" className="text-base">Notificações por E-mail</FormLabel>
                    </div>
                    <FormControl>
                      <Switch 
                        id="notif-email" 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        disabled={isUpdating}
                      />
                    </FormControl>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="notificacao_sms"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="space-y-1 flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <FormLabel htmlFor="notif-sms" className="text-base">Notificações por SMS</FormLabel>
                    </div>
                    <FormControl>
                      <Switch 
                        id="notif-sms" 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        disabled={isUpdating}
                      />
                    </FormControl>
                  </div>
                )}
              />
              
              <FormField
                control={form.control}
                name="notificacao_whatsapp"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="space-y-1 flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-secondary" />
                      <FormLabel htmlFor="notif-whatsapp" className="text-base">Notificações por WhatsApp (Z-API)</FormLabel>
                    </div>
                    <FormControl>
                      <Switch 
                        id="notif-whatsapp" 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        disabled={isUpdating}
                      />
                    </FormControl>
                  </div>
                )}
              />
            </div>

            <Separator />
            
            {/* Instruções de Configuração do WhatsApp */}
            <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Configuração do Z-API (WhatsApp)
                </h3>
                <p className="text-sm text-yellow-700">
                    Para que as notificações por WhatsApp funcionem, você deve configurar as chaves de acesso do Z-API diretamente no ambiente de Edge Functions do Supabase.
                </p>
                <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                    <li>Acesse o Supabase Console do seu projeto.</li>
                    <li>Vá para a seção **Edge Functions**.</li>
                    <li>Clique em **Manage Secrets**.</li>
                    <li>Adicione os seguintes segredos:
                        <ul className="list-disc list-inside ml-4 mt-1 font-mono text-xs">
                            <li><span className="font-bold">ZAPI_URL</span>: O URL base da sua instância Z-API.</li>
                            <li><span className="font-bold">ZAPI_TOKEN</span>: O token de acesso secreto do Z-API.</li>
                        </ul>
                    </li>
                    <li>Certifique-se de que a Edge Function `send-whatsapp-message` esteja implantada.</li>
                </ol>
                <p className="text-xs text-yellow-700 italic mt-3">
                    O VAGOU não armazena suas chaves de API no banco de dados por motivos de segurança.
                </p>
            </div>

            {/* Botões de Ação do Formulário */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="submit" className="w-48 bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isUpdating ? "Salvando..." : "Salvar Notificações"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default Notificacoes;