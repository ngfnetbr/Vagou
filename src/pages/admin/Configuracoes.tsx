import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Save, Settings2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Importar from "@/pages/parametros/Importar";
import TurmasBase from "@/pages/parametros/TurmasBase";
import { useConfiguracoes, ConfiguracoesFormData } from "@/hooks/use-configuracoes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/DatePicker"; // Importando DatePicker

// Esquema de validação para as configurações
const configSchema = z.object({
  nome_municipio: z.string().min(1, "O nome do município é obrigatório."),
  nome_secretaria: z.string().min(1, "O nome da secretaria é obrigatório."),
  email_contato: z.string().email("E-mail inválido.").optional().or(z.literal('')),
  telefone_contato: z.string().optional().or(z.literal('')),
  data_inicio_inscricao: z.string().optional().or(z.literal('')),
  data_fim_inscricao: z.string().optional().or(z.literal('')),
  prazo_resposta_dias: z.coerce.number().min(1, "O prazo deve ser no mínimo 1 dia."),
  notificacao_email: z.boolean(),
  notificacao_sms: z.boolean(),
});

const Configuracoes = () => {
  const { config, isLoading, error, updateConfiguracoes, isUpdating } = useConfiguracoes();

  const form = useForm<ConfiguracoesFormData>({
    resolver: zodResolver(configSchema),
    values: {
      nome_municipio: config?.nome_municipio || "",
      nome_secretaria: config?.nome_secretaria || "",
      email_contato: config?.email_contato || "",
      telefone_contato: config?.telefone_contato || "",
      data_inicio_inscricao: config?.data_inicio_inscricao || "",
      data_fim_inscricao: config?.data_fim_inscricao || "",
      prazo_resposta_dias: config?.prazo_resposta_dias || 7,
      notificacao_email: config?.notificacao_email ?? true,
      notificacao_sms: config?.notificacao_sms ?? false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ConfiguracoesFormData) => {
    await updateConfiguracoes(data);
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-lg text-muted-foreground">Carregando configurações...</p>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div className="text-center p-8 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive font-semibold">Erro ao carregar configurações: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Parâmetros gerais do sistema e configurações avançadas</p>
        </div>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="importar">Importar Dados</TabsTrigger>
            <TabsTrigger value="turmas-base">Turmas Base</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Configurações Gerais
                </CardTitle>
                <CardDescription>
                  Defina os parâmetros principais do sistema
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nome_municipio"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel htmlFor="nome-municipio">Nome do Município *</FormLabel>
                            <FormControl>
                              <Input id="nome-municipio" placeholder="Ex: Cidade Exemplo" {...field} disabled={isUpdating} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nome_secretaria"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel htmlFor="secretaria">Nome da Secretaria *</FormLabel>
                            <FormControl>
                              <Input id="secretaria" placeholder="Ex: Secretaria Municipal de Educação" {...field} disabled={isUpdating} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email_contato"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel htmlFor="email-contato">E-mail de Contato</FormLabel>
                            <FormControl>
                              <Input id="email-contato" type="email" placeholder="contato@prefeitura.gov.br" {...field} disabled={isUpdating} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefone_contato"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel htmlFor="telefone-contato">Telefone de Contato</FormLabel>
                            <FormControl>
                              <Input id="telefone-contato" placeholder="(00) 0000-0000" {...field} disabled={isUpdating} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Período de Inscrições</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="data_inicio_inscricao"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel htmlFor="data-inicio">Data de Início</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="dd/mm/aaaa"
                                  disabled={isUpdating}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="data_fim_inscricao"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel htmlFor="data-fim">Data de Término</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="dd/mm/aaaa"
                                  disabled={isUpdating}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Convocações</h3>

                      <FormField
                        control={form.control}
                        name="prazo_resposta_dias"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel htmlFor="prazo-resposta">Prazo para Resposta (dias) *</FormLabel>
                            <FormControl>
                              <Input
                                id="prazo-resposta"
                                type="number"
                                placeholder="7"
                                {...field}
                                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                disabled={isUpdating}
                              />
                            </FormControl>
                            <p className="text-sm text-muted-foreground">
                              Número de dias que o responsável tem para responder à convocação
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Notificações</h3>

                      <FormField
                        control={form.control}
                        name="notificacao_email"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <FormLabel htmlFor="notif-email">Notificações por E-mail</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Enviar e-mails automáticos para responsáveis
                              </p>
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
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <FormLabel htmlFor="notif-sms">Notificações por SMS</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Enviar SMS para convocações e alertas
                              </p>
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
                    </div>

                    <Separator />

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => form.reset()} disabled={isUpdating}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={isUpdating}>
                        {isUpdating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {isUpdating ? "Salvando..." : "Salvar Configurações"}
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="importar" className="mt-6">
            <Importar />
          </TabsContent>

          <TabsContent value="turmas-base" className="mt-6">
            <TurmasBase />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Configuracoes;