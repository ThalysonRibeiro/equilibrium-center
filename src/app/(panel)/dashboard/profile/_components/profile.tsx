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
  const [isLoadingCep, setIsLoadingCep] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://cep.awesomeapi.com.br/json/${cepValue}`);
        const data = await res.json();

        if (data.erro) {
          setResultInfoCEP(null);
          toast.error("CEP não encontrado", {
            description: "Verifique se o CEP foi digitado corretamente."
          });
          return;
        }

        setResultInfoCEP(data);
        lastFetchedCep.current = cepValue;
        toast.success("CEP encontrado com sucesso!");
      } catch {
        setResultInfoCEP(null);
        toast.error("Erro ao buscar CEP", {
          description: "Verifique sua conexão e tente novamente."
        });
      } finally {
        setIsLoadingCep(false);
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

  function toggleHour(hour: string) {
    setSelectedHours((prev) => {
      const newHours = prev.includes(hour)
        ? prev.filter(h => h !== hour)
        : [...prev, hour].sort();

      // Anunciar mudança para leitores de tela
      const isSelected = newHours.includes(hour);
      const message = isSelected
        ? `Horário ${hour} selecionado`
        : `Horário ${hour} removido da seleção`;

      // Usar setTimeout para garantir que o anúncio seja feito após a atualização do estado
      setTimeout(() => {
        const announcement = document.getElementById('hours-announcement');
        if (announcement) {
          announcement.textContent = message;
        }
      }, 100);

      return newHours;
    });
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
    setIsSubmitting(true);

    try {
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
        toast.error("Erro ao salvar perfil", {
          description: response.error,
          closeButton: true
        });
        return;
      }

      toast.success("Perfil atualizado com sucesso!", {
        description: response.data
      });
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Tente novamente em alguns instantes."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-semibold">Meu Perfil</h1>
            </CardHeader>
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
                      <FormLabel>Nome da clínica ou do profissional</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da clínica"
                          aria-describedby="name-description"
                          autoComplete="organization"
                        />
                      </FormControl>
                      <div id="name-description" className="sr-only">
                        Nome que será exibido publicamente no perfil
                      </div>
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
                          placeholder="Descrição da clínica"
                          className="max-h-30 h-25"
                          aria-describedby="description-help"
                          maxLength={500}
                        />
                      </FormControl>
                      <div id="description-help" className="text-sm text-muted-foreground">
                        Breve descrição sobre a clínica ou serviços oferecidos (máximo 500 caracteres)
                      </div>
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
                          type="tel"
                          autoComplete="tel"
                          aria-describedby="phone-format"
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value);
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <div id="phone-format" className="text-sm text-muted-foreground">
                        Formato: (DDD) número com 8 ou 9 dígitos
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <InputOTP
                            {...field}
                            maxLength={8}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            aria-describedby="cep-help cep-status"
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
                          <div id="cep-help" className="text-sm text-muted-foreground">
                            Digite apenas os números do CEP
                          </div>
                          {isLoadingCep && (
                            <div id="cep-status" className="text-sm text-blue-600" role="status" aria-live="polite">
                              Buscando informações do CEP...
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Estado será preenchido automaticamente"
                            readOnly
                            disabled
                            aria-describedby="state-help"
                          />
                        </FormControl>
                        <div id="state-help" className="text-sm text-muted-foreground">
                          Preenchido automaticamente com base no CEP
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Cidade será preenchida automaticamente"
                            readOnly
                            disabled
                            aria-describedby="city-help"
                          />
                        </FormControl>
                        <div id="city-help" className="text-sm text-muted-foreground">
                          Preenchida automaticamente com base no CEP
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>Endereço completo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Rua, avenida, praça..."
                            autoComplete="street-address"
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
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: 123, A55"
                            autoComplete="address-line2"
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
                      <FormLabel>Status da clínica</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"}
                          aria-describedby="status-help"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status da clínica" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">ATIVO (clínica aberta)</SelectItem>
                            <SelectItem value="inactive">INATIVO (clínica fechada)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div id="status-help" className="text-sm text-muted-foreground">
                        Define se a clínica está disponível para agendamentos
                      </div>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="hours-button">
                    Configurar horários da clínica
                  </Label>
                  <div className="text-sm text-muted-foreground mb-2">
                    {selectedHours.length > 0
                      ? `${selectedHours.length} horário${selectedHours.length > 1 ? 's' : ''} selecionado${selectedHours.length > 1 ? 's' : ''}`
                      : 'Nenhum horário selecionado'
                    }
                  </div>
                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        id="hours-button"
                        variant="outline"
                        className="bg-transparent w-full justify-between"
                        aria-describedby="hours-description"
                      >
                        Clique aqui para selecionar horários <ArrowRight aria-hidden="true" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="bg-white max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Horários da clínica</DialogTitle>
                        <DialogDescription>
                          Selecione abaixo os horários de funcionamento da clínica.
                          Use as teclas de seta para navegar e a barra de espaço ou Enter para selecionar.
                        </DialogDescription>
                      </DialogHeader>

                      <section className="py-4">
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          Clique nos horários abaixo para marcar ou desmarcar.
                          Horários selecionados: {selectedHours.length}
                        </p>

                        <div
                          className="grid grid-cols-4 gap-2"
                          role="group"
                          aria-labelledby="hours-grid-label"
                        >
                          <div id="hours-grid-label" className="sr-only">
                            Grade de seleção de horários de funcionamento
                          </div>
                          {hours?.map((hour) => {
                            const isSelected = selectedHours.includes(hour);
                            return (
                              <Button
                                key={hour}
                                type="button"
                                variant="ghost"
                                onClick={() => toggleHour(hour)}
                                className={cn(
                                  "border hover:text-white hover:bg-accent transition-colors",
                                  isSelected && 'bg-primary hover:bg-accent text-white'
                                )}
                                aria-pressed={isSelected}
                                aria-label={`${hour}${isSelected ? ', selecionado' : ', não selecionado'}`}
                              >
                                {hour}
                              </Button>
                            );
                          })}
                        </div>

                        {/* Elemento para anúncios de acessibilidade */}
                        <div
                          id="hours-announcement"
                          className="sr-only"
                          aria-live="polite"
                          aria-atomic="true"
                        ></div>
                      </section>

                      <Button
                        type="button"
                        className="hover:bg-accent transition-colors duration-300"
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Fechar modal
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <div id="hours-description" className="text-sm text-muted-foreground">
                    Defina os horários em que a clínica estará disponível para atendimento
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o fuso horário</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          aria-describedby="timezone-help"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZones.map(zone => (
                              <SelectItem key={zone} value={zone}>
                                {zone.replace('America/', '').replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div id="timezone-help" className="text-sm text-muted-foreground">
                        Fuso horário usado para exibir os horários de agendamento
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full hover:bg-accent transition-colors duration-300"
                  disabled={isSubmitting}
                  aria-describedby="submit-help"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                </Button>
                <div id="submit-help" className="text-sm text-muted-foreground text-center">
                  {isSubmitting ? 'Aguarde enquanto salvamos suas alterações' : 'Clique para salvar todas as alterações do perfil'}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}