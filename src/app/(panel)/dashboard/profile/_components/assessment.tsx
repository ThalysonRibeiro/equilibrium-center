"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./starRating";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState, useCallback, useMemo } from "react";
import { AssessmentFormData, useAssessmentForm } from "./assessment-form";
import { createNewAssessment } from "../_actions/create-assessment";
import { toast } from "sonner";
import { UserWithAssessment } from "./assessment-content";
import { updateAssessment } from "../_actions/update-assessment";
import { Loader2, X, MessageSquare, Star } from "lucide-react";

interface AssessmentProps {
  user: UserWithAssessment | null;
  editAssessment?: Dispatch<SetStateAction<boolean>>;
}

export function Assessment({ user, editAssessment }: AssessmentProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Memoizar valores iniciais para evitar recriação
  const initialAssessment = useMemo(() => ({
    rating: user?.assessments?.rating || 0,
    message: user?.assessments?.message || "",
  }), [user?.assessments?.rating, user?.assessments?.message]);

  const isEditing = useMemo(() => !!user?.assessments, [user?.assessments]);

  const form = useAssessmentForm({
    defaultValues: initialAssessment
  });

  // Memoizar função de validação
  const isFormValid = useCallback(() => {
    const message = form.watch("message");
    const rating = form.watch("rating");
    return message && message.trim().length > 0 && rating > 0;
  }, [form]);

  // Usar useCallback para evitar recriações desnecessárias
  const onUpdate = useCallback(async ({ message, rating }: { message: string, rating: number }) => {
    try {
      toast.info("Atualizando avaliação...", {
        description: "Aguarde enquanto salvamos suas alterações."
      });

      const response = await updateAssessment({
        message: message || initialAssessment.message,
        rating: rating || initialAssessment.rating,
      });

      if (response.error) {
        toast.error("Erro ao atualizar avaliação", {
          description: response.error
        });
        return;
      }

      toast.success("Avaliação atualizada com sucesso!", {
        description: response.data
      });

      form.reset();
      handleClose();
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Tente novamente em alguns instantes."
      });
      console.error("Update assessment error:", error);
    }
  }, [form, initialAssessment]);

  const onSubmit = useCallback(async (values: AssessmentFormData) => {
    if (loading) return;

    try {
      setLoading(true);
      setHasInteracted(true);

      // Validar dados antes de enviar
      if (!values.message || values.message.trim().length === 0) {
        toast.error("Erro de validação", {
          description: "Por favor, digite uma mensagem para sua avaliação."
        });
        return;
      }

      if (!values.rating || values.rating === 0) {
        toast.error("Erro de validação", {
          description: "Por favor, selecione uma classificação de estrelas."
        });
        return;
      }

      if (isEditing) {
        await onUpdate({
          message: values.message || initialAssessment.message,
          rating: values.rating || initialAssessment.rating
        });
        return;
      }

      // Criar nova avaliação
      toast.info("Enviando avaliação...", {
        description: "Aguarde enquanto processamos sua avaliação."
      });

      const response = await createNewAssessment({
        message: values.message,
        rating: values.rating,
      });

      if (response.error) {
        toast.error("Erro ao enviar avaliação", {
          description: response.error
        });
        return;
      }

      toast.success("Avaliação enviada com sucesso!", {
        description: response.data
      });

      form.reset();
      handleClose();

    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Tente novamente em alguns instantes."
      });
      console.error("Assessment error:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, isEditing, onUpdate, initialAssessment, form]);

  const handleClose = useCallback(() => {
    form.reset();
    setHasInteracted(false);
    if (editAssessment) {
      editAssessment(prev => !prev);
    }
  }, [form, editAssessment]);

  // Lidar com teclas de atalho
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Esc para fechar
    if (event.key === 'Escape' && editAssessment) {
      handleClose();
    }
    // Ctrl+Enter para enviar
    if (event.ctrlKey && event.key === 'Enter' && isFormValid()) {
      form.handleSubmit(onSubmit)();
    }
  }, [editAssessment, handleClose, isFormValid, form, onSubmit]);

  return (
    <div
      onKeyDown={handleKeyDown}
      role="main"
      aria-labelledby="assessment-title"
    >
      <Card className="focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle
                id="assessment-title"
                className="flex items-center gap-2 text-xl lg:text-2xl"
              >
                <MessageSquare className="w-5 h-5 text-accent" aria-hidden="true" />
                {isEditing ? "Atualizar avaliação" : "Deixe sua avaliação"}
              </CardTitle>
              <CardDescription className="mt-2">
                Sua opinião é importante! Avalie sua experiência com o site e nos ajude a melhorar.
                {isEditing && (
                  <span className="block mt-1 text-sm text-amber-600">
                    Você está editando uma avaliação existente.
                  </span>
                )}
              </CardDescription>
            </div>

            {editAssessment && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="flex-shrink-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                aria-label="Fechar formulário de avaliação"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              aria-describedby="form-instructions"
            >
              <div id="form-instructions" className="sr-only">
                Preencha sua mensagem e selecione uma classificação de estrelas para enviar sua avaliação.
                Use Ctrl+Enter para enviar rapidamente ou Escape para fechar.
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" aria-hidden="true" />
                      Sua mensagem
                      <span className="text-red-500" aria-label="campo obrigatório">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Conte-nos sobre sua experiência com o site. O que funcionou bem? O que poderia melhorar?"
                        className="max-h-52 h-35 resize-none focus:ring-2 focus:ring-accent focus:border-accent"
                        rows={4}
                        maxLength={1000}
                        aria-describedby={field.value ? "message-counter" : undefined}
                        aria-invalid={form.formState.errors.message ? "true" : "false"}
                      />
                    </FormControl>
                    {field.value && (
                      <div id="message-counter" className="text-xs text-gray-500 text-right">
                        {field.value.length}/300 caracteres
                      </div>
                    )}
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => {
                  const handleValue = useCallback((value: number) => {
                    setHasInteracted(true);
                    field.onChange(value);
                  }, [field]);

                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Star className="w-4 h-4" aria-hidden="true" />
                        Classificação
                        <span className="text-red-500" aria-label="campo obrigatório">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <StarRating
                            onValorChange={handleValue}
                            ratingValue={field.value}
                            aria-label="Selecione uma classificação de 1 a 5 estrelas"
                            aria-describedby="rating-description"
                          />
                          <div id="rating-description" className="text-xs text-gray-600">
                            Clique nas estrelas para avaliar (1 = ruim, 5 = excelente)
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage role="alert" />
                    </FormItem>
                  )
                }}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={!isFormValid() || loading}
                  aria-describedby="submit-help"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span aria-live="polite">
                          {isEditing ? "Atualizando..." : "Enviando..."}
                        </span>
                      </>
                    ) : (
                      <span>
                        {isEditing ? "Atualizar avaliação" : "Enviar avaliação"}
                      </span>
                    )}
                  </span>
                </Button>

                {editAssessment && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={loading}
                    className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    aria-label="Cancelar edição"
                  >
                    Cancelar
                  </Button>
                )}
              </div>

              <div id="submit-help" className="text-xs text-gray-500">
                {!isFormValid() && hasInteracted && (
                  <span role="alert" className="text-red-600">
                    Por favor, preencha todos os campos obrigatórios.
                  </span>
                )}
                <span className="block mt-1">
                  Dica: Use Ctrl+Enter para enviar rapidamente
                </span>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}