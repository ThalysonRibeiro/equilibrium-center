"use client"
import { Card, CardContent } from "./ui/card";
import {
  Form,
  FormControl, FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";

interface UseFormContactProps {
  name: string;
  email: string;
  message: string;
}

const formContactSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  email: z.string().email({ message: "O email é obrigatório" }),
  message: z.string().min(1, { message: "A mensagem é obrigatório" })
});

type FormContactData = z.infer<typeof formContactSchema>;

function useFormContact({ name, email, message }: UseFormContactProps) {
  return useForm<FormContactData>({
    resolver: zodResolver(formContactSchema),
    defaultValues: {
      name: name || "",
      email: email || "",
      message: message || ""
    }
  });
}
interface FormContactProps {
  label?: boolean;
}

export function FormContact({ label = false }: FormContactProps) {
  const [isLoading, setIsLoading] = useState(false);


  const form = useFormContact({
    name: "",
    email: "",
    message: ""
  });

  async function onSubmit(values: FormContactData): Promise<void> {
    setIsLoading(true);
    try {
      const response = await fetch('https://api-email-topaz.vercel.app/api/send', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar e-mail');
      }

      await response.json();
      toast.success("Enviado com sucesso!");
      form.reset();
      toast.success("Enviado com sucesso!");
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto py-2">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      {label && (<FormLabel>Nome</FormLabel>)}
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite seu nome."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      {label && (<FormLabel>Email</FormLabel>)}
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite seu email."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      {label && (<FormLabel>Mensagem</FormLabel>)}
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descreva sua mensagem."
                          className="h-28 max-h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className={`w-full hover:bg-accent cursor-pointer ${isLoading && "cursor-not-allowed"}`}>
                  {isLoading
                    ? <div className="w-4 h-4 border border-t-primary rounded-full animate-spin" />
                    : "Enviar"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  )
}