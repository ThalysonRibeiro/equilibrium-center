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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Prisma } from "@/generated/prisma"
import { updateProfile } from "../_actions/update-profile"
import { toast } from "sonner"
import { formatPhone } from "@/utils/fomatPhone"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AvatarProfile } from "./profile-avatar"
import { Textarea } from "@/components/ui/textarea"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfileContentProps {
  user: UserWithSubscription | null;
}

type SearshCEP = {
  district?: string;
  cep: string;
  state: string;
  city: string;
  address: string;
}

export function ProfileContent(
  { user }: ProfileContentProps
) {

  const { update } = useSession();
  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<string[]>(user?.times ?? []);
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const lastFetchedCep = useRef<string | null>(null);
  const [inputOTP, setInputOTP] = useState(user?.cep || "");
  const [resultInfoCEP, setResultInfoCEP] = useState<SearshCEP | null>(
    user?.cep
      ? {
        cep: user.cep,
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
      }
      : null
  );

  const form = useProfileForm({
    name: user?.name || null,
    address: user?.address || null,
    description: user?.description || null,
    phone: user?.phone || null,
    city: user?.city || null,
    state: user?.state || null,
    cep: user?.cep || null,
    number: user?.number || null,
    status: user?.status as boolean,
    timeZone: user?.timeZone || null
  });

  const cepValue = form.watch("cep");

  useEffect(() => {
    const isInvalidCep = !cepValue || cepValue.length !== 8;
    const isSameAsUserCep = user?.cep === cepValue;
    const isAlreadyFetched = cepValue === lastFetchedCep.current;

    if (isInvalidCep || isSameAsUserCep || isAlreadyFetched) {
      setResultInfoCEP(null);
      return;
    }

    const fetchCep = async () => {
      try {
        const res = await fetch(`https://cep.awesomeapi.com.br/json/${cepValue}`);
        const data = await res.json();

        if (data.erro) {
          setResultInfoCEP(null);
          toast.error("CEP não encontrado");
          return;
        }

        setResultInfoCEP(data);
        lastFetchedCep.current = cepValue;
      } catch {
        setResultInfoCEP(null);
        toast.error("Erro ao buscar CEP");
      }
    };

    fetchCep();
  }, [cepValue, user]);



  useEffect(() => {
    if (!resultInfoCEP) return;
    form.setValue("address", resultInfoCEP.address || "");
    form.setValue("city", resultInfoCEP.city || "");
    form.setValue("state", resultInfoCEP.state || "");
    form.setValue("cep", inputOTP);

    // Força o re-render dos campos
    form.trigger(["address", "city", "state", "cep"]);
  }, [resultInfoCEP, form]);




  function generateTimeSlots(): string[] {
    const hours: string[] = [];

    for (let i = 5; i <= 23; i++) {
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

    const response = await updateProfile({
      name: values.name,
      address: values.address,
      description: values.description,
      phone: values.phone,
      city: values.city,
      state: values.state,
      cep: values.cep,
      number: values.number,
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

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>Meu Perfil</CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <AvatarProfile
                  avatarUrl={user?.image || null}
                  userId={user?.id!}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da clinica ou do profissional</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da clinica."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descrição da clinica."
                          className="max-h-30 h-25"
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
                  name="cep"
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <InputOTP
                          {...field}
                          maxLength={8}
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          onChange={(value) => {
                            field.onChange(value);
                            setInputOTP(value);
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    // disabled={true}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite o Estado"
                            readOnly
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    // disabled={true}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite a cidade"
                            readOnly
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                <div className="flex gap-4">

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Endereço completo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite o endereço da clinica. ex: rua centro"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem className="max-w-25">
                        <FormLabel>Numero</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex:A55"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

                    <DialogContent className="bg-white">
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
                              variant={"ghost"}
                              onClick={() => togglreHour(hour)}
                              className={cn("border hover:text-white hover:bg-accent", selectedHours.includes(hour) && 'bg-primary hover:bg-accent text-white')}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>

                      </section>
                      <Button
                        className="hover:bg-accent transition-colors duration-300"
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
                  className="w-full hover:bg-accent transition-colors duration-300"
                >
                  Salvar alterações
                </Button>

              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}