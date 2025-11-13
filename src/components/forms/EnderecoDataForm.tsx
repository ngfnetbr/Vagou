"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { InscricaoFormData } from "@/lib/schemas/inscricao-schema";

export const EnderecoDataForm = () => {
  const { control } = useFormContext<InscricaoFormData>();

  return (
    <>
      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço Residencial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="endereco"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="endereco">Endereço</FormLabel>
                  <FormControl>
                    <Input id="endereco" placeholder="Rua, número, complemento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="bairro"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="bairro">Bairro</FormLabel>
                  <FormControl>
                    <Input id="bairro" placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="observacoes"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel htmlFor="observacoes">Observações</FormLabel>
                <FormControl>
                  <Textarea id="observacoes" placeholder="Informações adicionais" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
};