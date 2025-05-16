"use client"
import { ProfileFormData, useProfileForm } from "./profile-form"
import {
  Form,
  FormControl, FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import img_test from "@/assets/3.png"
import { Prisma } from "@/generated/prisma"
import { updateProfile } from "../_actions/update-profile"
import { toast } from "sonner"
import { extractPhoneNumber, formatPhone } from "@/utils/fomatPhone"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfileContentProps {
  user: UserWithSubscription | null;
}

export function ProfileContent(
  { user }: ProfileContentProps
) {

  const { update } = useSession();
  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<string[]>(user?.times ?? []);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

  const form = useProfileForm({
    name: user?.name || null,
    addess: user?.address || null,
    phone: user?.phone || null,
    status: user?.status as boolean,
    timeZone: user?.timeZone || null
  });

  function generateTimeSlots(): string[] {
    const hours: string[] = [];

    for (let i = 6; i <= 23; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 30).toString().padStart(2, "0")
        hours.push(`${hour === "24" ? "00" : hour}:${minute}`)
      }
    }

    return hours;
  }

  const hours = generateTimeSlots();

  function togglreHour(hour: string) {
    setSelectedHours((prev) => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort())
  }

  const timeZones = Intl.supportedValuesOf("timeZone").filter(zone =>
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Boa_Vista") ||
    zone.startsWith("America/Brasilia")
  );

  async function onSubmit(values: ProfileFormData) {
    const extractValue = extractPhoneNumber(values.phone || "");
    console.log(extractValue);

    const response = await updateProfile({
      name: values.name,
      addess: values.addess,
      phone: values.phone,
      status: values.status === 'active' ? true : false,
      timeZone: values.timeZone,
      times: selectedHours || []
    });

    if (response.error) {
      toast.error(response.error, { closeButton: true });
      return;
    }

    toast.success(response.data);

  }

  async function handleLogout() {
    await signOut();
    await update();
    router.replace("/")
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>Meu Perfil</CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-gray-300 relative w-40 h-40 rounded-full overflow-hidden">
                  <Image
                    src={user?.image ? user?.image : img_test}
                    alt="imagem de perfil"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da clinica"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="addess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço completo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o endereço da clinica"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(00) 00000-0000"
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value);
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status da clinica</FormLabel>
                      <FormControl>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status da clinuca" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">ATIVO (clinica aberta)</SelectItem>
                            <SelectItem value="inactive">INATIVO (clinica fechada)</SelectItem>
                          </SelectContent>
                        </Select>

                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>
                    Configurar horários da clinica
                  </Label>
                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant={"outline"} className="bg-transparent w-full justify-between">
                        Clique aqui para selecionar ohrários <ArrowRight />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="boder border-corprimary">
                      <DialogHeader>
                        <DialogTitle className="text-center">Horários da clinica</DialogTitle>
                        <DialogDescription className="text-center">
                          Selecione abaixo os horários de funcionamento da clinica
                        </DialogDescription>
                      </DialogHeader>

                      <section className="py-4">
                        <p className="text-sm text-muted-foreground text-center mb-2">
                          Clique nos horários abaixo para marcar ou desmarcar
                        </p>

                        <div className="grid grid-cols-4 gap-2">
                          {hours?.map((hour) => (
                            <Button
                              key={hour}
                              onClick={() => togglreHour(hour)}
                              className={cn("border border-corprimary", selectedHours.includes(hour) && 'border-corsecondary bg-corsecondary')}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>

                      </section>
                      <Button
                        className="bg-corprimary hover:bg-corsecondary transition-colors duration-300"
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Fechar modal
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selecione o fuso horário
                      </FormLabel>
                      <FormControl>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu fuso horário" />
                          </SelectTrigger>

                          <SelectContent>
                            {timeZones.map(zone => (
                              <SelectItem key={zone} value={zone}>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-corsecondary hover:bg-corprimary transition-colors duration-300"
                >
                  Salvar alterações
                </Button>

              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <section className="mt-4">
        <Button onClick={handleLogout} variant={"destructive"}>
          Sair da conta
        </Button>
      </section>
    </div>
  )
}