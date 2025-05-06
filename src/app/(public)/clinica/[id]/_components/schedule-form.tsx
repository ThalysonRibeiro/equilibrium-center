"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const appointmentSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
});

export type AppoitmentFormData = z.infer<typeof appointmentSchema>;

export function useAppoitmentForm() {
  return useForm<AppoitmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: new Date(),
      serviceId: "",
    }
  })
}