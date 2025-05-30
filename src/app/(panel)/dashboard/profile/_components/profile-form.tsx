import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


interface UserProfileFormProps {
  name: string | null;
  address: string | null;
  description: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  cep: string | null;
  number: string | null;
  status: boolean;
  timeZone: string | null;
}


const profileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  address: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  cep: z.string().optional(),
  number: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(1, { message: "O time zone é obrigatório" })
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({
  name,
  address,
  description,
  phone,
  city,
  state,
  cep,
  number,
  status,
  timeZone
}: UserProfileFormProps) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name || "",
      address: address || "",
      description: description || "",
      phone: phone || "",
      city: city || "",
      state: state || "",
      cep: cep || "",
      number: number || "",
      status: status ? "active" : "inactive",
      timeZone: timeZone || "",
    }
  })
}