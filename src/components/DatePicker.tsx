"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  value?: string; // Espera uma string no formato "YYYY-MM-DD"
  onChange: (dateString: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, placeholder = "Selecione uma data", disabled }: DatePickerProps) {
  const date = value ? new Date(value + 'T00:00:00') : undefined; 
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "");

  React.useEffect(() => {
    if (date && isValid(date)) {
      setInputValue(format(date, "dd/MM/yyyy", { locale: ptBR }));
    } else if (value === "") {
      setInputValue("");
    }
  }, [date, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);

    const parsedDate = parse(text, "dd/MM/yyyy", new Date(), { locale: ptBR });

    if (isValid(parsedDate) && format(parsedDate, "dd/MM/yyyy", { locale: ptBR }) === text) {
      onChange(format(parsedDate, "yyyy-MM-dd"));
    } else if (text === "") {
      onChange("");
    }
  };

  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      const formattedForForm = format(selectedDate, "yyyy-MM-dd");
      onChange(formattedForForm);
      setInputValue(format(selectedDate, "dd/MM/yyyy", { locale: ptBR }));
      setOpen(false);
    } else {
      onChange("");
      setInputValue("");
    }
  };

  return (
    <div className="relative flex items-center"> {/* Este div agrupa visualmente o input e o botão */}
      <Input
        id="date-input"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className={cn(
          "w-full pr-10", // Adiciona padding-right para o ícone
          !date && "text-muted-foreground",
          "hover:bg-primary/10 hover:text-primary"
        )}
        disabled={disabled}
      />
      <Popover open={open} onOpenChange={setOpen}> {/* O Popover agora envolve apenas o Trigger e o Content */}
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 py-2 rounded-l-none"
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}