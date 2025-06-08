"use client"

import Image from "next/image"
import img_test from "@/assets/img-hero.jpg"
import { MapPin } from "lucide-react"
import { Prisma } from "@/generated/prisma"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AppoitmentFormData, useAppoitmentForm } from "./schedule-form"
import { Input } from "@/components/ui/input"
import { formatPhone } from "@/utils/fomatPhone"
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { ScheduleTimeList } from "./schedule-time-list"
import { createNewAppointment } from "../_actions/create-appointment"
import { toast } from "sonner"
import { LoadingUI } from "@/components/ui/loading-ui"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import img_bg from "@/assets/bg-3.png";

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
    service: true;
    times: true;
  };
}>;

type ServiceWithStringPrice = Omit<UserWithServiceAndSubscription["service"][0], "price"> & {
  price: string;
};

type UserWithConvertedService = Omit<UserWithServiceAndSubscription, "service"> & {
  service: ServiceWithStringPrice[];
};

interface ScheduleContentProps {
  clinic: UserWithConvertedService;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoitmentForm();
  const { watch } = form;

  const selectedDate = watch("date")
  const selectedServiceId = watch("serviceId")

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([])

  // Função que busca os horários bloqueados (via Fetch HTTP)
  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
    setLoadingSlots(true);
    try {
      const dateString = date.toISOString().split("T")[0]
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`)

      const json = await response.json();
      setLoadingSlots(false);
      return json;
    } catch (err) {
      setLoadingSlots(false);
      return [];
    }
  }, [clinic.id])

  useEffect(() => {
    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked)

        const times = clinic.times || [];

        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time)
        }));

        setAvailableTimeSlots(finalSlots);

        const stilAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
        );
        if (!stilAvailable) {
          setSelectedTime("");
        }
      })
    }
  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])

  function calculateAge(nascimento: Date): number {
    const today = new Date();
    let theAge = today.getFullYear() - nascimento.getFullYear();
    const month = today.getMonth() - nascimento.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < nascimento.getDate())) {
      theAge--;
    }

    return theAge < 0 ? 0 : theAge;
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'dateOfBirth' && value.dateOfBirth) {
        const theDateOfBirth = new Date(value.dateOfBirth);
        const ageCalculated = calculateAge(theDateOfBirth);

        form.setValue('age', ageCalculated);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function handleRegisterAppointmnent(formData: AppoitmentFormData) {
    if (!selectedTime) {
      toast.error("Por favor, selecione um horário para o agendamento");
      return;
    }

    const useOfAnyMedication = formData?.useOfAnyMedication === "yes" ? true : false;
    const bePregnant = formData?.bePregnant === "yes" ? true : false;
    const eatingRoutine = formData?.eatingRoutine === "yes" ? true : false;

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      dateOfBirth: formData.dateOfBirth,
      symptoms: formData.symptoms,
      secondary: formData.secondary,
      complaints: formData.complaints,
      useOfAnyMedication: useOfAnyMedication,
      bePregnant: bePregnant,
      eatingRoutine: eatingRoutine,
      physicalActivities: formData.physicalActivities,
      time: selectedTime,
      date: formData.date,
      serviceId: formData.serviceId,
      clinicId: clinic.id
    });

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success("Agendamento realizado com sucesso");
    form.reset();
    setSelectedTime("");
  }

  return (
    <div className="min-h-screen flex flex-col mb-6">
      {/* Header Section */}
      <header
        className="w-full h-80 flex items-center justify-center mx-auto px-4 relative inset-0"
        role="banner"
      >
        <div className="h-80 -z-[1] bg-gradient-to-br from-teal-300/80 to-teal-500/80 shadow absolute inset-0" />

        <Image
          className="object-cover absolute w-full h-80 -z-[2] inset-0"
          src={clinic.image ? clinic.image : img_test}
          alt={`Imagem de fundo da clínica ${clinic.name}`}
          width={1280}
          height={280}
          priority
        />

        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white">
              <Image
                src={clinic.image ? clinic.image : img_test}
                alt={`Logo da clínica ${clinic.name}`}
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-4xl text-white font-semibold text-center">
              {clinic.name}
            </h1>

            <p className="text-center text-sm text-white line-clamp-2">
              {clinic.description}
            </p>

            <address className="mb-2 not-italic">
              <span className="text-white flex items-center gap-1" role="img" aria-label="Localização">
                <MapPin className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Endereço: </span>
                {clinic.address ? clinic.address : "Endereço não informado"}
                {clinic.number ? `, nº ${clinic.number}` : ""}
                {clinic.city && clinic.state ? ` - ${clinic.city}-${clinic.state}` : ""}
                {clinic.cep ? `, CEP ${clinic.cep}` : ""}
              </span>
            </address>
          </article>
        </div>
      </header>

      {/* Form Section */}
      <main className="max-w-2xl mx-auto w-full mt-6" role="main">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
            className="mx-4 space-y-6 bg-white p-6 rounded-md border"
            noValidate
            aria-label="Formulário de agendamento"
          >
            {/* Seção de Informações Pessoais */}
            <fieldset className="space-y-4">
              <legend className="font-semibold text-lg text-center">
                Informações pessoais
              </legend>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel htmlFor="name">Nome completo*</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Digite seu nome completo..."
                          autoComplete="name"
                          aria-required="true"
                          aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage id="name-error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel htmlFor="email">Email*</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Digite seu email"
                          autoComplete="email"
                          aria-required="true"
                          aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage id="email-error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel htmlFor="phone">Telefone*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder="(00) 00000-0000"
                          autoComplete="tel"
                          aria-required="true"
                          aria-describedby={form.formState.errors.phone ? "phone-error" : undefined}
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value);
                            field.onChange(formattedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage id="phone-error" />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="my-2 w-1/2">
                        <FormLabel htmlFor="age">Idade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="age"
                            type="number"
                            readOnly
                            placeholder="0"
                            aria-label="Idade calculada automaticamente"
                            tabIndex={-1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="my-2 w-1/2">
                        <FormLabel htmlFor="dateOfBirth">Data de nascimento</FormLabel>
                        <FormControl>
                          <DateTimePicker
                            initialDate={new Date()}
                            minDate={new Date(1900, 0, 1)}
                            activeYear={true}
                            className="rounded-md border px-2 py-1"
                            aria-label="Selecione sua data de nascimento"
                            onChange={(date) => {
                              field.onChange(date)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </fieldset>

            {/* Seção de Informações Clínicas */}
            <fieldset className="space-y-4">
              <legend className="font-semibold text-lg text-center">
                Informações Clínicas
              </legend>

              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="symptoms">
                      Quais são suas principais queixas e sintomas?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="symptoms"
                        placeholder="Descreva suas principais queixas e sintomas"
                        className="max-h-30 h-20"
                        aria-describedby="symptoms-help"
                      />
                    </FormControl>
                    <div id="symptoms-help" className="sr-only">
                      Descreva detalhadamente seus sintomas para melhor atendimento
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="secondary">
                      Quais são suas queixas ou sintomas secundários?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="secondary"
                        placeholder="Descreva suas queixas ou sintomas secundários"
                        className="max-h-30 h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complaints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="complaints">
                      Qual é o histórico dessas queixas?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="complaints"
                        placeholder="Descreva o histórico das suas queixas"
                        className="max-h-30 h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* Seção de Informações Adicionais */}
            <fieldset className="space-y-4">
              <legend className="font-semibold text-lg text-center">
                Informações Adicionais
              </legend>

              <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:justify-between">
                <FormField
                  control={form.control}
                  name="useOfAnyMedication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faz uso de alguma medicação?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          aria-required="false"
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="yes"
                              id="medication-yes"
                              aria-describedby="medication-yes-label"
                            />
                            <Label htmlFor="medication-yes" id="medication-yes-label">
                              Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="not"
                              id="medication-no"
                              aria-describedby="medication-no-label"
                            />
                            <Label htmlFor="medication-no" id="medication-no-label">
                              Não
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bePregnant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Está ou pode estar grávida?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="yes"
                              id="pregnant-yes"
                              aria-describedby="pregnant-yes-label"
                            />
                            <Label htmlFor="pregnant-yes" id="pregnant-yes-label">
                              Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="not"
                              id="pregnant-no"
                              aria-describedby="pregnant-no-label"
                            />
                            <Label htmlFor="pregnant-no" id="pregnant-no-label">
                              Não
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eatingRoutine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pratica atividades físicas?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="yes"
                              id="exercise-yes"
                              aria-describedby="exercise-yes-label"
                            />
                            <Label htmlFor="exercise-yes" id="exercise-yes-label">
                              Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="not"
                              id="exercise-no"
                              aria-describedby="exercise-no-label"
                            />
                            <Label htmlFor="exercise-no" id="exercise-no-label">
                              Não
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="physicalActivities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="physicalActivities">
                      Como é sua rotina alimentar?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="physicalActivities"
                        placeholder="Descreva sua rotina alimentar"
                        className="max-h-30 h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {/* Seção de Agendamento */}
            <fieldset className="space-y-4">
              <legend className="font-semibold text-lg text-center">
                Agendamento
              </legend>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Data do agendamento*</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          initialDate={new Date()}
                          className="rounded-md border px-2 py-1"
                          aria-label="Selecione a data do agendamento"
                          aria-required="true"
                          onChange={(date) => {
                            if (date) {
                              field.onChange(date)
                              setSelectedTime("");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Selecione o serviço*</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedTime("");
                          }}
                          aria-required="true"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            {clinic.service.map(service => (
                              <SelectItem
                                key={service.id}
                                value={service.id}
                                aria-label={`${service.name}, duração ${Math.floor(service.duration / 60)} horas e ${service.duration % 60} minutos`}
                              >
                                {service.name} ({Math.floor(service.duration / 60)}h {service.duration % 60}min)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedServiceId && (
                <div className="space-y-2">
                  <Label>Horários disponíveis*</Label>
                  <div
                    className="bg-gray-100 p-2 rounded-md border"
                    role="region"
                    aria-label="Lista de horários disponíveis"
                  >
                    {loadingSlots ? (
                      <div role="status" aria-live="polite">
                        <LoadingUI />
                        <span className="sr-only">Carregando horários disponíveis...</span>
                      </div>
                    ) : availableTimeSlots.length === 0 ? (
                      <p role="status" aria-live="polite">
                        Nenhum horário disponível para esta data
                      </p>
                    ) : (
                      <ScheduleTimeList
                        onSelecTime={(time) => setSelectedTime(time)}
                        clinicTimes={clinic.times}
                        blockedTimes={blockedTimes}
                        availableTimeSlots={availableTimeSlots}
                        selectedTime={selectedTime}
                        selectedDate={selectedDate}
                        requiredSlots={
                          clinic.service.find(serv => serv.id === selectedServiceId)
                            ? Math.ceil(clinic.service.find(serv => serv.id === selectedServiceId)!.duration / 30)
                            : 1
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </fieldset>

            {/* Status da Clínica e Botão de Submit */}
            {clinic.status ? (
              <Button
                type="submit"
                className="hover:bg-accent w-full"
                disabled={
                  !watch("name") ||
                  !watch("email") ||
                  !watch("phone") ||
                  !watch("date") ||
                  !selectedTime
                }
                aria-describedby="submit-help"
              >
                Realizar agendamento
              </Button>
            ) : (
              <div
                className="bg-red-500 text-white rounded-md text-center px-4 py-2"
                role="alert"
                aria-live="polite"
              >
                A clínica está fechada neste momento
              </div>
            )}

            <div id="submit-help" className="sr-only">
              Preencha todos os campos obrigatórios e selecione um horário para continuar
            </div>

            {/* Termos e Condições */}
            <section
              className="max-w-2xl mx-auto w-full mt-6 space-y-2 px-4 text-[12px]"
              aria-labelledby="terms-heading"
            >
              <h3 id="terms-heading" className="sr-only">
                Termos de confidencialidade e consentimento
              </h3>
              <p>
                Sua terapia será conduzida de forma estritamente confidencial. As informações pessoais
                fornecidas durante todo o procedimento da terapia, bem como esta ficha de anamnese,
                não serão divulgadas para ninguém.
              </p>
              <p>
                Ao preencher este formulário, você reconhece que leu e concordou com o exposto acima,
                bem como está ciente de que o sucesso terapêutico também depende do seguimento das
                recomendações profissionais concedidas.
              </p>
            </section>
          </form>
        </Form>
      </main>
    </div>
  )
}