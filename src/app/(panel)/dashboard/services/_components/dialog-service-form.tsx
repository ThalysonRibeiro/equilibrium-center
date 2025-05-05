import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "O nome do serviço é obrigatório"),
  price: z.string().min(1, "O preço do serviço é obrigatório"),
  hours: z.string(),
  minutes: z.string(),
});

export interface UseeDialogServiceFormProps {
  initialValues?: {
    name: string;
    price: string;
    hours: string;
    minutes: string;
  }
}

export type DialogServiceFormData = z.infer<typeof formSchema>;

export function UseeDialogServiceForm({ initialValues }: UseeDialogServiceFormProps) {
  return useForm<DialogServiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      price: "",
      hours: "",
      minutes: "",
    }
  })
}