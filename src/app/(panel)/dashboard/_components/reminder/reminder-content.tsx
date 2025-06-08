"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ReminderFormdata, useReminderForm } from "./reminder-form"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReminder } from "../../_actions/create-reminder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReminderContentProps {
  closeDialog: () => void;
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useReminderForm();

  async function onSubmit(formData: ReminderFormdata) {
    setIsSubmitting(true);

    try {
      const response = await createReminder({ description: formData.description });

      if (response?.error) {
        toast.error(response?.error);
        return;
      }

      toast.success(response?.data);
      router.refresh();
      closeDialog();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
          role="form"
          aria-label="Formulário para criar lembrete"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">
                  Descreva o lembrete
                  <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Digite o nome do lembrete..."
                    className="max-h-52"
                    aria-describedby={form.formState.errors.description ? "description-error" : undefined}
                    aria-invalid={!!form.formState.errors.description}
                    aria-required="true"
                    rows={4}
                  />
                </FormControl>
                <FormMessage
                  id="description-error"
                  role="alert"
                  aria-live="polite"
                />
              </FormItem>
            )}
          />

          <Button
            className="w-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="submit"
            disabled={!form.watch("description") || isSubmitting}
            aria-describedby="submit-button-help"
          >
            {isSubmitting ? (
              <>
                <span className="sr-only">Carregando...</span>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar lembrete"
            )}
          </Button>

          <div id="submit-button-help" className="sr-only">
            {!form.watch("description")
              ? "Preencha a descrição do lembrete para habilitar o botão de cadastro"
              : "Clique para cadastrar o lembrete"
            }
          </div>
        </form>
      </Form>
    </div>
  )
}