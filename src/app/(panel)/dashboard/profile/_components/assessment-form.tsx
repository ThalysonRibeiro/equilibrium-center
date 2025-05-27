import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const assessmentsSchema = z.object({
  message: z.string()
    .min(1, { message: "A mensagem da avaliação é obrigatória" })
    .max(300, { message: "A mensagem deve ter no máximo 300 caracteres." }),
  rating: z.number()
    .int({ message: "A classificação deve ser um número inteiro" })
    .min(1, { message: "A classificação é obrigatória" })
    .max(5, { message: "A classificação deve ter no máximo 5" })
});

export type AssessmentFormData = z.infer<typeof assessmentsSchema>;

type UseAssessmentFormParams = {
  defaultValues?: Partial<AssessmentFormData>;
};

export function useAssessmentForm({ defaultValues }: UseAssessmentFormParams = {}) {
  return useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentsSchema),
    defaultValues: {
      message: "",
      rating: 0,
      ...defaultValues, // sobrescreve os valores padrão
    },
  });
}