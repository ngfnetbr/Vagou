"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  nomeCompleto: z.string().min(2, {
    message: "O nome completo deve ter pelo menos 2 caracteres.",
  }),
  dataNascimento: z.date({
    required_error: "A data de nascimento é obrigatória.",
  }),
  sexo: z.enum(["feminino", "masculino", "nao-informar"], {
    required_error: "Você precisa selecionar um sexo.",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  telefone: z.string().min(10, {
    message: "O telefone deve ter pelo menos 10 dígitos.",
  }),
  endereco: z.string().min(5, {
    message: "O endereço deve ter pelo menos 5 caracteres.",
  }),
  cidade: z.string().min(2, {
    message: "A cidade deve ter pelo menos 2 caracteres.",
  }),
  estado: z.string().min(2, {
    message: "O estado deve ter pelo menos 2 caracteres.",
  }),
  cep: z.string().min(8, {
    message: "O CEP deve ter 8 dígitos.",
  }),
  nacionalidade: z.string().min(2, {
    message: "A nacionalidade deve ter pelo menos 2 caracteres.",
  }),
  rg: z.string().min(7, {
    message: "O RG deve ter pelo menos 7 caracteres.",
  }),
  cpf: z.string().min(11, {
    message: "O CPF deve ter 11 dígitos.",
  }),
  profissao: z.string().min(2, {
    message: "A profissão deve ter pelo menos 2 caracteres.",
  }),
  escolaridade: z.string({
    required_error: "Por favor, selecione sua escolaridade.",
  }),
  estadoCivil: z.string({
    required_error: "Por favor, selecione seu estado civil.",
  }),
  rendaMensal: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "A renda mensal deve ser um valor numérico.",
  }),
  termos: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos e condições.",
  }),
});

export default function Inscricao() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      nacionalidade: "",
      rg: "",
      cpf: "",
      profissao: "",
      rendaMensal: "",
      termos: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Formulário enviado com sucesso!", {
      description: JSON.stringify(values, null, 2),
    });
    console.log(values);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Formulário de Inscrição</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informações Pessoais */}
          <div className="space-y-6 p-6 rounded-lg border bg-card shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Informações Pessoais</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nomeCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataNascimento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Nascimento *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3 p-4 rounded-lg border bg-card">
                <Label className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">Sexo *</Label>
                <RadioGroup
                  onValueChange={form.setValue.bind(null, "sexo")}
                  defaultValue={form.getValues("sexo")}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feminino" id="r1" />
                    <Label htmlFor="r1">Feminino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masculino" id="r2" />
                    <Label htmlFor="r2">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao-informar" id="r3" />
                    <Label htmlFor="r3">Prefiro não informar</Label>
                  </div>
                </RadioGroup>
                {form.formState.errors.sexo && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.sexo.message}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-6 p-6 rounded-lg border bg-card shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Endereço</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço *</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade *</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP *</FormLabel>
                    <FormControl>
                      <Input placeholder="XXXXX-XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Outras Informações */}
          <div className="space-y-6 p-6 rounded-lg border bg-card shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Outras Informações</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nacionalidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nacionalidade *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brasileira" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG *</FormLabel>
                    <FormControl>
                      <Input placeholder="XX.XXX.XXX-X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF *</FormLabel>
                    <FormControl>
                      <Input placeholder="XXX.XXX.XXX-XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="profissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissão *</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua profissão" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="escolaridade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escolaridade *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua escolaridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                        <SelectItem value="medio">Ensino Médio</SelectItem>
                        <SelectItem value="superior">Ensino Superior</SelectItem>
                        <SelectItem value="pos-graduacao">Pós-Graduação</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estadoCivil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Civil *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu estado civil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="rendaMensal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renda Mensal (R$) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2500.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Termos e Condições */}
          <FormField
            control={form.control}
            name="termos"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Eu aceito os termos e condições.
                  </FormLabel>
                  <FormDescription>
                    Ao marcar esta caixa, você concorda com o processamento dos seus dados.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Enviar Inscrição</Button>
        </form>
      </Form>
    </div>
  );
}